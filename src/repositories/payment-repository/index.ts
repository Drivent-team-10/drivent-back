import { prisma } from '@/config';
import { Payment } from '@prisma/client';

export type PaymentInsertData = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

async function createPayment(paymentData: PaymentInsertData): Promise<Payment> {
  return prisma.payment.create({
    data: paymentData,
  });
}

async function findPaymentByReservationId(reservationId: number): Promise<Payment> {
  return prisma.payment.findFirst({
    where: { reservationId },
  });
}

const paymentRepository = {
  createPayment,
  findPaymentByReservationId,
};

export default paymentRepository;
