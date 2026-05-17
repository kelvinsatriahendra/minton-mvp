'use server'

import { createServerSupabaseClient } from '@/utils/supabase';

export async function getAvailableVouchers() {
  const supabase = createServerSupabaseClient();
  const now = new Date().toISOString();

  const { data } = await supabase
    .from('vouchers')
    .select('*')
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('created_at', { ascending: false });

  return (data ?? []).map((v: any) => ({
    id: v.id,
    code: v.code,
    description: v.description,
    discount_type: v.discount_type,
    discount_value: v.discount_value,
    max_discount: v.max_discount,
    min_purchase: v.min_purchase,
    usage_limit: v.usage_limit,
    used_count: v.used_count,
    expires_at: v.expires_at,
  }));
}

export async function validateVoucher(code: string, totalPrice: number) {
  const supabase = createServerSupabaseClient();
  const now = new Date().toISOString();

  const codeUpper = code.toUpperCase().trim();

  const { data: voucher } = await supabase
    .from('vouchers')
    .select('*')
    .eq('code', codeUpper)
    .single();

  if (!voucher) return { valid: false, error: 'Kode voucher tidak ditemukan' };
  if (!voucher.is_active) return { valid: false, error: 'Voucher sudah tidak aktif' };
  if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) return { valid: false, error: 'Voucher sudah kedaluwarsa' };
  if (voucher.usage_limit > 0 && voucher.used_count >= voucher.usage_limit) return { valid: false, error: 'Voucher sudah habis digunakan' };
  if (totalPrice < voucher.min_purchase) return { valid: false, error: `Minimal pembelian Rp ${voucher.min_purchase.toLocaleString('id-ID')} untuk voucher ini` };

  let discountAmount = 0;
  if (voucher.discount_type === 'percentage') {
    discountAmount = Math.round(totalPrice * voucher.discount_value / 100);
    if (voucher.max_discount && discountAmount > voucher.max_discount) {
      discountAmount = voucher.max_discount;
    }
  } else {
    discountAmount = voucher.discount_value;
    if (discountAmount > totalPrice) discountAmount = totalPrice;
  }

  return {
    valid: true,
    discountAmount,
    code: codeUpper,
    discount_type: voucher.discount_type,
    description: voucher.description,
  };
}

export async function redeemVoucher(code: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.rpc('increment_voucher_used', { v_code: code });
  if (error) {
    // Fallback: direct update
    const { error: updateErr } = await supabase
      .from('vouchers')
      .update({ used_count: supabase.rpc('increment', { x: 1 }) })
      .eq('code', code);
    if (updateErr) {
      // Simpler fallback
      const { data: v } = await supabase.from('vouchers').select('used_count').eq('code', code).single();
      if (v) {
        await supabase.from('vouchers').update({ used_count: v.used_count + 1 }).eq('code', code);
      }
    }
  }
  return { success: true };
}
