import React, { useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.scss";

const Dropdown = ({ options, value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className={styles.dropdown} ref={ref}>
      <div className={styles.toggle} onClick={() => setOpen((o) => !o)}>
        {selected ? selected.label : placeholder}
        <span className={styles.arrow}>▾</span>
      </div>
      {open && (
        <div className={styles.menu}>
          {options.map((o) => (
            <div
              key={o.value}
              className={styles.item}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
