
export interface Location {
  lat: number;
  lng: number;
}

export interface Volunteer {
  id: string;
  name: string;
  distance: string;
  eta: string;
  karma: number;
  avatar: string | null;
}

export type RequestStatus = "accepted" | "searching" | "completed" | "canceled";

export interface RequestDetails {
  id: string;
  type: string;
  title: string;
  location: Location;
  description: string;
  createdAt: string;
  status: RequestStatus;
  volunteer?: Volunteer;
}
