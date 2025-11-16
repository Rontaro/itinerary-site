import React from 'react';

export default function SimpleCheckbox({ isChecked, onChange, size = 'lg', isDarkMode = false, ...props }) {
    const dim = size === 'lg' ? 20 : size === 'sm' ? 14 : 16; // px
    const borderColor = isDarkMode ? '#4A5568' : '#CBD5E0';
    const checkedBg = '#2C7A7B'; // teal.600-ish
    const uncheckedBg = 'transparent';

    return (
        <label
            onClick={(e) => e.stopPropagation()}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer'
            }}
        >
            <input
                type="checkbox"
                checked={!!isChecked}
                onChange={onChange}
                style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                {...props}
            />
            <span
                aria-hidden
                style={{
                    width: dim,
                    height: dim,
                    minWidth: dim,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 6,
                    border: `2px solid ${isChecked ? checkedBg : borderColor}`,
                    background: isChecked ? checkedBg : uncheckedBg,
                    boxShadow: isChecked ? 'inset 0 0 0 2px rgba(255,255,255,0.06)' : 'none',
                    transition: 'all 0.15s ease',
                }}
            >
                {isChecked && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.2 1L4.8 8L1 4.2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </span>
        </label>
    );
}

