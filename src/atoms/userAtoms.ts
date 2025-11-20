import {atom} from 'jotai';
import {atomWithStorage} from 'jotai/utils';
import {User} from "../../lib/types";

export const userAtom = atomWithStorage<User | null>('user', null);
export const userProfileAtom = atom((get) => get(userAtom)?.profile || null);