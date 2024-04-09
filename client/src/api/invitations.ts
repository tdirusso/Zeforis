import request from '../lib/request';
import type { CreateInvitationsRequest } from '@shared/types/Invitation';

const createInvitations = async (engagementId: number, payload: CreateInvitationsRequest) => {
  return (await request.post<void>(`/engagements/${engagementId}/invitations`, payload)).data;
};

export {
  createInvitations
};