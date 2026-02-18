"use client";

import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useId,
  useState,
} from "react";

interface IinputProps {
  name: string;
  type: string;
  globalValue? : {
    [key: string]: string;
  };
  onChange? : (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  isPassword?: boolean;
  className?: string;
  placeholder?: string;
}

const Input = ({
  type,
  className,
  label,
  onChange,
  isPassword = false,
  name,
  placeholder,
  globalValue,
  ...rest
}: IinputProps) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const id = useId();
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className="mt-4 text-sm text-gray-700">
          {label}
        </label>
      )}
      <div className="mt-2 flex items-center rounded bg-gray-100">
        <input
          id={id}
          type={isPassword ? (passwordShown ? type : "password") : type}
          name={name}
          value={globalValue?.[name] || ""}
          onChange={onChange}
          className={`w-full grow px-4 py-2 outline-none placeholder:text-sm ${className}`}
          placeholder={placeholder || ""}
          {...rest}
        />
        {isPassword && (
          <span
            className="mr-2 grid cursor-pointer place-items-center"
            onClick={() => {
              setPasswordShown(!passwordShown);
            }}
          >
            <span className="material-symbols-rounded">
              {!passwordShown ? "visibility_off" : "visibility"}
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
