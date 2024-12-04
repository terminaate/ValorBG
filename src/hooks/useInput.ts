import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';

type UseInputChange = (
  e: ChangeEvent<HTMLInputElement>,
) => boolean | void | Promise<boolean> | Promise<void>;

type UseInputReturn = [
  string,
  ChangeEventHandler<HTMLInputElement>,
  Dispatch<SetStateAction<string>>,
];

export const useInput = (
  initialState = '',
  onChange?: UseInputChange,
): UseInputReturn => {
  const [state, setState] = useState(initialState);

  const onInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const result = await onChange?.(e);

    if (result === false) {
      return;
    }

    setState(e.target.value);
  };

  return [state, onInputChange, setState];
};
