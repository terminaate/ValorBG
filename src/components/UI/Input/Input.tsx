import {
  ChangeEvent,
  FC,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
} from 'react';
import classNames from 'classnames';
import { open, OpenDialogOptions } from '@tauri-apps/plugin-dialog';
import { useTranslation } from 'react-i18next';
import cl from './Input.module.scss';
import { Button } from '@/components/UI/Button';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  fileOptions?: OpenDialogOptions;
  label?: string;
  labelMargin?: number;
};

const FileInput: FC<InputProps> = ({
  className,
  onChange,
  fileOptions,
  ...props
}) => {
  const { t } = useTranslation();

  const onFileInputClick = async () => {
    const result = await open(fileOptions).catch(() => null);

    if (result === null) {
      return;
    }

    const changeEvent = {
      target: {
        files: Array.isArray(result) ? result : [result],
        value: Array.isArray(result) ? result[0] : result,
      },
    };

    onChange?.(changeEvent as unknown as ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className={cl.fileInputContainer}>
      <input
        {...props}
        readOnly
        data-file={true}
        className={classNames(cl.input, className)}
        type={'text'}
        onClick={onFileInputClick}
      />
      <Button className={cl.fileInputButton} onClick={onFileInputClick}>
        {t('input.browseFilesButton', 'Select')}
      </Button>
    </div>
  );
};

const CheckboxInput: FC<InputProps> = (props) => {
  const { checked, className } = props;

  const onCheckboxClick = () => {
    const changeEvent = {
      target: {
        checked: !checked,
      },
    };

    props.onChange?.(changeEvent as unknown as ChangeEvent<HTMLInputElement>);
  };

  return (
    <div
      {...props}
      data-active={!!checked}
      onClick={onCheckboxClick}
      className={classNames(cl.checkboxContainer, className)}
    />
  );
};

const DefaultInput: FC<InputProps> = ({ className, onChange, ...props }) => {
  return (
    <input
      {...props}
      onChange={onChange}
      className={classNames(cl.input, className)}
    />
  );
};

const InputComponents: Partial<Record<HTMLInputTypeAttribute, FC<InputProps>>> =
  {
    file: FileInput,
    checkbox: CheckboxInput,
  };

export const Input: FC<InputProps> = ({ labelMargin = 17, ...props }) => {
  const { type, label, className } = props;

  const InputComponent = InputComponents[type ?? 'text'] ?? DefaultInput;

  if (label) {
    return (
      <div
        style={{ rowGap: labelMargin }}
        className={classNames(cl.inputContainer, className)}
      >
        <span className={cl.inputLabel}>{label}</span>
        <InputComponent {...props} />
      </div>
    );
  }

  return <InputComponent {...props} />;
};
