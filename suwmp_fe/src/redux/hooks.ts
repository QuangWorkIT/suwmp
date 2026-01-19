import type { AppDispath, RootState } from "./store";
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

// useDispatch and useSelector with types deifined
export const useAppDispatch = () => useDispatch<AppDispath>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector