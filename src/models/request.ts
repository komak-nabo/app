export interface Request {
  _id: string;
  status: 'pending';
  requesterShortName: string;
  acceptorShortName: string;
  requesterProfileId: string;
  acceptorProfileId: string;
  type: 'misc';
  createdAt: string;
  profileIds: string[];
  updatedAt: string;
}
