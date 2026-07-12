import { NextResponse } from 'next/server';
import { RESPONSE_CODES } from '@/constants/responseCodes';

export function successResponse(data = {}, message = 'Success', status = RESPONSE_CODES.OK) {
  return NextResponse.json({
    success: true,
    message,
    data
  }, { status });
}

export function errorResponse(message = 'An error occurred', errors = [], status = RESPONSE_CODES.INTERNAL_ERROR) {
  return NextResponse.json({
    success: false,
    message,
    errors
  }, { status });
}

export function paginationResponse(data, total, page, limit, message = 'Success') {
  return NextResponse.json({
    success: true,
    message,
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }, { status: RESPONSE_CODES.OK });
}
