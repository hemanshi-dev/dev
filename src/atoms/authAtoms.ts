import {atom} from 'jotai';
import {atomWithStorage} from 'jotai/utils';

export const tokenAtom = atomWithStorage<string | null>('auth_token', null);
export const isAuthenticatedAtom = atom((get) => !!get(tokenAtom));