export type Invitation = {
  email: string,
  engagementId: number,
  token: string,
  dateCreated: Date,
  dateExpires: Date;
};

export interface CreateInvitationsRequest {
  users: {
    email: string,
    role: 'admin' | 'member';
  }[];
}

export interface CreateInvitationsResponse {
  usersInvited: {
    email: string,
    status: string;
  }[];
}