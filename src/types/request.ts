
export interface Location {
  lat: number;
  lng: number;
}

export interface Profile {
  id: string;
  full_name: string | null;
  dob: string | null;
  aadhaar_number: string | null;
  photo_url: string | null;
  is_verified: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone_number: string;
  relationship: string | null;
}

export interface Volunteer {
  id: string;
  name: string;
  distance: string;
  eta: string;
  karma: number;
  avatar: string | null;
}

export type RequestStatus = "searching" | "accepted" | "completed" | "canceled";

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
