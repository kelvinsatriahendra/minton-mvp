'use server'

import { createServerSupabaseClient } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';

export async function getWallet(userEmail: string) {
  const supabase = createServerSupabaseClient();

  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_email', userEmail)
    .maybeSingle();

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_email', userEmail)
    .order('created_at', { ascending: false })
    .limit(10);

  return {
    balance: wallet?.balance ?? 0,
    transactions: transactions ?? [],
  };
}

export async function getAllTransactions(userEmail: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_email', userEmail)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function ensureWallet(userEmail: string) {
  if (!userEmail) return { success: false };

  const supabase = createServerSupabaseClient();

  const { data: existing } = await supabase
    .from('wallets')
    .select('id')
    .eq('user_email', userEmail)
    .maybeSingle();

  if (!existing) {
    const { error } = await supabase.from('wallets').insert({ user_email: userEmail, balance: 0 });
    if (error) {
      console.error('ensureWallet error:', error);
      return { success: false, error: error.message };
    }
  }
  return { success: true };
}

export async function topUp(userEmail: string, amount: number) {
  if (!userEmail) return { success: false, message: 'Silakan login terlebih dahulu.' };
  if (amount < 1000) return { success: false, message: 'Minimal top-up Rp 1.000' };

  const supabase = createServerSupabaseClient();

  const walletResult = await ensureWallet(userEmail);
  if (!walletResult.success) return { success: false, message: 'Gagal menyiapkan wallet. Periksa kembali akun Anda.' };

  const { error: txError } = await supabase.from('transactions').insert({
    user_email: userEmail,
    type: 'topup',
    amount: amount,
    description: 'Top Up saldo Minton Pay',
    status: 'completed',
  });

  if (txError) {
    console.error('topUp tx error:', txError);
    return { success: false, message: 'Gagal mencatat transaksi. Pastikan tabel wallet & transaksi sudah ada di database.' };
  }

  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_email', userEmail)
    .single();

  if (walletError) {
    console.error('topUp wallet fetch error:', walletError);
    return { success: false, message: 'Gagal mengambil saldo wallet.' };
  }

  const newBalance = (wallet?.balance ?? 0) + amount;

  const { error: updateError } = await supabase
    .from('wallets')
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq('user_email', userEmail);

  if (updateError) {
    console.error('topUp update error:', updateError);
    return { success: false, message: 'Gagal memperbarui saldo.' };
  }

  revalidatePath('/minton-pay');
  return { success: true, message: `Top Up Rp ${amount.toLocaleString()} berhasil!` };
}

function formatAmount(n: number) {
  return n.toLocaleString('id-ID');
}

export async function transfer(senderEmail: string, amount: number, destinationEmail: string) {
  if (!senderEmail) return { success: false, message: 'Silakan login terlebih dahulu.' };
  if (!destinationEmail) return { success: false, message: 'Email tujuan tidak valid.' };
  if (amount < 1000) return { success: false, message: 'Minimal transfer Rp 1.000' };
  if (senderEmail === destinationEmail) return { success: false, message: 'Tidak bisa transfer ke diri sendiri.' };

  const supabase = createServerSupabaseClient();

  const w1 = await ensureWallet(senderEmail);
  if (!w1.success) return { success: false, message: 'Gagal menyiapkan wallet pengirim.' };
  const w2 = await ensureWallet(destinationEmail);
  if (!w2.success) return { success: false, message: 'Gagal menyiapkan wallet penerima.' };

  const { data: senderWallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_email', senderEmail)
    .single();

  if ((senderWallet?.balance ?? 0) < amount) {
    return { success: false, message: 'Saldo tidak mencukupi.' };
  }

  const { data: destUser } = await supabase
    .from('users')
    .select('nama_lengkap')
    .eq('email', destinationEmail)
    .maybeSingle();

  const destName = destUser?.nama_lengkap || destinationEmail;

  const { error: txOutError } = await supabase.from('transactions').insert({
    user_email: senderEmail,
    type: 'transfer_out',
    amount: amount,
    description: `Transfer ke ${destName}`,
    status: 'completed',
  });

  if (txOutError) return { success: false, message: 'Gagal mencatat transaksi.' };

  const { error: txInError } = await supabase.from('transactions').insert({
    user_email: destinationEmail,
    type: 'transfer_in',
    amount: amount,
    description: `Transfer dari ${senderEmail}`,
    status: 'completed',
  });

  if (txInError) return { success: false, message: 'Gagal mencatat transaksi penerima.' };

  const senderBalance = (senderWallet?.balance ?? 0) - amount;

  const { data: destWallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_email', destinationEmail)
    .single();

  const destBalance = (destWallet?.balance ?? 0) + amount;

  await supabase.from('wallets').update({ balance: senderBalance, updated_at: new Date().toISOString() }).eq('user_email', senderEmail);
  await supabase.from('wallets').update({ balance: destBalance, updated_at: new Date().toISOString() }).eq('user_email', destinationEmail);

  revalidatePath('/minton-pay');
  return { success: true, message: `Transfer Rp ${formatAmount(amount)} ke ${destName} berhasil!` };
}
