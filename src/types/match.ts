import {
  killerMatch,
  survivorMatch,
  killer,
  survivor,
  map,
  matchHistory,
} from "@/generated/prisma";

// Types de base pour les éléments
export type PerkType = {
  id: string;
  name: string;
  image: string | null;
};

export type AddOnType = {
  id: string;
  name: string;
  image: string | null;
};

export type OfferingType = {
  id: string;
  name: string;
  image: string | null;
};

// Types étendus avec les relations incluses
export type KillerMatchWithRelations = killerMatch & {
  killer: killer;
  map: map;
  perks: PerkType[];
  addOns: AddOnType[];
  offerings: OfferingType[];
};

export type SurvivorMatchWithRelations = survivorMatch & {
  survivor: survivor;
  killer: killer;
  map: map;
  perks: PerkType[];
  addOns: AddOnType[];
  offerings: OfferingType[];
  survivorObject?: {
    id: string;
    name: string;
    image: string | null;
  } | null;
};

export type MatchHistoryWithRelations = matchHistory & {
  killerMatches: KillerMatchWithRelations[];
  survivorMatches: SurvivorMatchWithRelations[];
};
