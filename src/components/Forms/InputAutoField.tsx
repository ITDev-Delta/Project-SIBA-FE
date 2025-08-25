import { AutoComplete } from 'antd';
import { useState } from 'react';


interface porps {
    options: string[];
    style?: React.CSSProperties;
    placeholder?: string;
    value?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;

}


// const [optionList, setOptionList] = useState<display[]>([])

const InputAutoField: React.FC<porps> = ({ options, style, placeholder, value = "", disabled = false, onChange }) => {
    
    const [displayValue, setDisplayValue] = useState<string>(value);
    const getDisplayValue = (option: any) => {
        if (typeof option === "string") {
            return option; // Jika opsi berupa string, kembalikan string tersebut
        }
        if (!option || typeof option !== "object") {
            return ""; // Jika option tidak valid, kembalikan string kosong
        }
        return (
            option.alias ??
            option.toString() // Sebagai fallback untuk data lain
        );
    };

    const transformedOptions = options.map((option) =>
        typeof option === "string"
            ? { label: option, value: option }
            : {
                label: getDisplayValue(option),
                value: JSON.stringify(option), // Serialize seluruh objek untuk mempermudah akses
            }
    );


    return (
        <AutoComplete
            options={transformedOptions}
            placeholder={placeholder}
            value={displayValue}
            disabled={disabled}
            onChange={(value) => {
                setDisplayValue(value);
                onChange?.(value);
            }}
            style={{
                ...style,
                minWidth: 200,
                width: "100%",
                height: "2.5rem",
                backgroundColor: "transparent",
            }}
            filterOption={(inputValue, option) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
        />
    )
};

export default InputAutoField;