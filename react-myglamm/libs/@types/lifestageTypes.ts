export type LifeStageSlug = "expecting-a-baby" | "new-parents" | "toddler";

export type LifeStageType = {
  id: number;
  name: string;
  pinkIcon: string;
  whiteIcon: string;
  title: string;
  dateInput: string;
  slug: LifeStageSlug;
  options: string;
  text: string;
};

export interface PropTypes {
  selectedLifeStage?: LifeStageType;
  setSelectedLifeStage: (lifestageId: number) => void;
}
