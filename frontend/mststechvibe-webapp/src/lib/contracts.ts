export type HealthResponse = {
  status: string;
};

export type VibeMessage = {
  id: string;
  title: string;
  description: string;
  createdAtUtc: string;
  createdByUserId: string;
};

export type CreateVibeMessageInput = {
  title: string;
  description: string;
};

export type ApiProblem = {
  message?: string;
};