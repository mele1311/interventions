export interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: "admin" | "technicien" | "directeur";
  created_at: string;
}

export interface Intervention {
  id: string;
  user_id: string;
  full_name: string;
  problem_description: string;
  location: string;
  actions_taken: string;
  date_of_intervention: string;
  is_solved: boolean;
  created_at: string;
}
