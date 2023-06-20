import { ClassNamesConfig, GroupBase, StylesConfig } from "react-select";

export default {
    classNames: {
        control: (props) => ` input input-bordered  border-slate-900  focus:outline-offset-0 text-white border-0 bg-slate-900 px-2`,
        input: () => ' border-0 text-white',
        container: () => 'bg-slate-900 ',
        valueContainer: () => ' ',
        singleValue: () => 'badge badge-neutral text-light ',
        multiValue: () => 'badge badge-secondary flex items-center p-0',
        multiValueLabel: () => 'text-light p-1 ',
        multiValueRemove: () => 'text-light  m-0 -me-[1.1px]',
        indicatorsContainer: () => 'bg-dark-900 ',
    },
    styles: {
        container: (base, props) => ({
            ...base,
            borderRadius: '1.9rem',
            transition: 'box-shadow 0.15s ease-in-out',
            boxShadow: props.isFocused ? '0 0 0 0.11rem rgb(37 155 194 / 30%)' : base.boxShadow,
        }),
        control: (base, props) => ({
            ...base,
            backgroundColor: '#111827',
            borderColor: '#374151',
            borderRadius: '1.9rem',
            transition: 'box-shadow 0.15s ease-in-out',
            boxShadow: props.isFocused ? '0 0 0 0.5px #E5E7EB' : base.boxShadow,
            ":hover": {
                borderColor: '#374151',
            },
            ":focus": {
                borderColor: '#374151',
            },
            // shadow: props.isFocused ? '0 0 0 0.2rem var(--bs-gray-800)' : base.boxShadow
        }),
        // valueContainer: (base) => ({
        //     ...base, borderRadius: '1.9rem 0 0 1.9rem'
        // }),
        // indicatorsContainer: (base) => ({
        //     ...base, borderRadius: '0 1.9rem 1.9rem 0'
        // }),
        input(base, props) {
            return {
                ...base,
                color: '#F9FAFB',
            }
        },
        indicatorSeparator: (base) => ({
            ...base, backgroundColor: '#64748B'
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: '#1F2937',
            borderColor: '#374151',
        }),
        menuList: (base) => ({
            ...base, backgroundColor: '#1F2937',
            borderRadius: '0.3rem',
            borderColor: '#374151',
        }),
        menuPortal: (base) => ({
            ...base, backgroundColor: '#4B5563'
        }),
        option: (base, props) => ({
            ...base,
            backgroundColor: props.isFocused && !props.isSelected ? '#4B5563' : base.backgroundColor,
            ":hover": {
                backgroundColor: props.isFocused && !props.isSelected ? '#4B5563' : base.backgroundColor,
            }
        }),
        multiValue(base, props) {
            return {
                ...base,
                backgroundColor: "#6EE7B7",
                borderRadius: '0.3rem',
            }
        },
        multiValueRemove: (base) => ({
            ...base,
            // height: '100%',
            padding: '3px 0',
            borderRadius: '0.3rem',
            ":hover": {
                backgroundColor: '#FB7185'
            }
        }),

    }
} as {
    classNames: ClassNamesConfig<{
        value: string;
        label: string;
    }, true, GroupBase<{
        value: string;
        label: string;
    }>>,
    styles: StylesConfig<{
        value: string;
        label: string;
    }, true, GroupBase<{
        value: string;
        label: string;
    }>>
}