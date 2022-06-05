import { prisma } from '@/config';
import { Payment } from '@prisma/client';

export type PaymentInsertData = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

async function createPayment(paymentData: PaymentInsertData): Promise<Payment> {
  return prisma.payment.create({
    data: paymentData,
  });
}

const paymentRepository = {
  createPayment,
};

export default paymentRepository;
