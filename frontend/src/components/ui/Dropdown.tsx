import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

export interface DropdownItem {
  id: string | number;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

interface DropdownProps {
  label: string;
  items: DropdownItem[];
  buttonClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
  icon?: React.ReactNode;
  align?: 'left' | 'right';
  fullWidth?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  items,
  buttonClassName = '',
  menuClassName = '',
  itemClassName = '',
  icon,
  align = 'left',
  fullWidth = false,
}) => {
  const defaultButtonClasses = 'inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary';
  const buttonClasses = `${defaultButtonClasses} ${buttonClassName} ${fullWidth ? 'w-full' : ''}`;
  
  const alignmentClasses = align === 'left' ? 'left-0 origin-top-left' : 'right-0 origin-top-right';
  const defaultMenuClasses = `absolute mt-2 ${alignmentClasses} rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10`;
  const menuClasses = `${defaultMenuClasses} ${menuClassName} ${fullWidth ? 'w-full' : 'w-56'}`;
  
  const defaultItemClasses = 'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900';
  const itemClasses = `${defaultItemClasses} ${itemClassName}`;

  return (
    <Menu as="div" className={`relative inline-block text-left ${fullWidth ? 'w-full' : ''}`}>
      {({ open }) => (
        <>
          <div>
            <Menu.Button className={buttonClasses}>
              {icon && <span className="mr-2">{icon}</span>}
              {label}
              <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
            </Menu.Button>
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className={menuClasses}>
              <div className="py-1">
                {items.map((item) => (
                  <Menu.Item key={item.id} disabled={item.disabled}>
                    {({ active }) => (
                      <button
                        type="button"
                        className={`${itemClasses} ${active ? 'bg-gray-100 text-gray-900' : ''} ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={item.onClick}
                        disabled={item.disabled}
                      >
                        <div className="flex items-center">
                          {item.icon && <span className="mr-2">{item.icon}</span>}
                          {item.label}
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default Dropdown;