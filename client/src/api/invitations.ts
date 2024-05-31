import request from '../lib/request';
import type { CreateInvitationsRequest, Invitation } from '@shared/types/Invitation';

const createInvitations = async (engagementId: number, payload: CreateInvitationsRequest) => {
  return (await request.post<Invitation[]>(`/engagements/${engagementId}/invitations`, payload)).data;
};

export {
  createInvitations
};