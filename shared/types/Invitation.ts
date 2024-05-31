export type Invitation = {
  email: string,
  engagementId: number,
  dateCreated: string,
  dateExpires: string;
  role: 'admin' | 'member';
  isAccepted: boolean;
};

export interface CreateInvitationsRequest {
  users: {
    email: string,
    role: 'admin' | 'member';
  }[];
}