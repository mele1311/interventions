export interface User {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "user";
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

export const mockUsers: User[] = [
  { id: "1", full_name: "Admin Principal", email: "admin@interventions.com", role: "admin", created_at: "2024-01-10" },
  { id: "2", full_name: "Jean Dupont", email: "jean@example.com", role: "user", created_at: "2024-02-15" },
  { id: "3", full_name: "Marie Curie", email: "marie@example.com", role: "user", created_at: "2024-03-20" },
  { id: "4", full_name: "Pierre Martin", email: "pierre@example.com", role: "user", created_at: "2024-04-05" },
  { id: "5", full_name: "Sophie Bernard", email: "sophie@example.com", role: "user", created_at: "2024-05-12" },
];

export const mockInterventions: Intervention[] = [
  { id: "1", user_id: "2", full_name: "Jean Dupont", problem_description: "Fuite d'eau dans le sous-sol du bâtiment B", location: "Bâtiment B - Sous-sol", actions_taken: "Fermeture de la vanne principale, appel du plombier", date_of_intervention: "2024-06-15", is_solved: true, created_at: "2024-06-15" },
  { id: "2", user_id: "3", full_name: "Marie Curie", problem_description: "Panne électrique au 3ème étage", location: "Bâtiment A - 3ème étage", actions_taken: "Vérification du tableau électrique, remplacement du disjoncteur", date_of_intervention: "2024-06-18", is_solved: true, created_at: "2024-06-18" },
  { id: "3", user_id: "2", full_name: "Jean Dupont", problem_description: "Ascenseur bloqué entre le 2ème et 3ème étage", location: "Bâtiment C - Ascenseur principal", actions_taken: "Appel du service de maintenance, évacuation des occupants", date_of_intervention: "2024-07-02", is_solved: false, created_at: "2024-07-02" },
  { id: "4", user_id: "4", full_name: "Pierre Martin", problem_description: "Vitres cassées suite à la tempête", location: "Bâtiment A - Façade nord", actions_taken: "Sécurisation de la zone, commande de nouvelles vitres", date_of_intervention: "2024-07-10", is_solved: false, created_at: "2024-07-10" },
  { id: "5", user_id: "5", full_name: "Sophie Bernard", problem_description: "Problème de chauffage dans les bureaux", location: "Bâtiment D - 1er étage", actions_taken: "Purge des radiateurs, vérification de la chaudière", date_of_intervention: "2024-07-20", is_solved: true, created_at: "2024-07-20" },
  { id: "6", user_id: "3", full_name: "Marie Curie", problem_description: "Infiltration d'eau par la toiture", location: "Bâtiment B - Toiture", actions_taken: "Bâchage temporaire, demande de devis pour réparation", date_of_intervention: "2024-08-01", is_solved: false, created_at: "2024-08-01" },
];
