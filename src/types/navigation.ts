import { DateEntry } from "./models";

export type RootStackParamList = {
  Home: undefined;
  GroupList: undefined;
  AddGroup: undefined;
  Dashboard: { groupId: string };
  AddMember: { groupId: string };
  MemberInfo: { memberId: string };
  ScanPresence: { groupId: string };
  InformationsDate: { groupId: string; dateEntry: DateEntry };
};
