import { atom } from "recoil";

export const CreateServerModalState = atom({
  key: "CreateServerModalState",
  default: false,
});

export const CreateChannelModalState = atom({
  key: "CreateChannelModalState",
  default: false,
});

export const EditServerModalState = atom({
  key: "EditServerModalState",
  default: false,
});

export const EditChannelModalState = atom({
  key: "EditChannelModalState",
  default: false,
});
