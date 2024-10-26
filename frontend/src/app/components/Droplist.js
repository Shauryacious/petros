'use client';
import React, { useState, useEffect } from 'react';

export default function Droplist({ list = [], getvalue, PLACEHOLDER}) {
  const [selectedItem, setSelectedItem] = useState('Select an item');
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filteredItems, setFilteredItems] = useState(list); // State for filtered list
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Control dropdown visibility

  // Update filtered items when search term changes
  useEffect(() => {
    const filtered = list.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, list]);

  // Handle item selection
  const handleSelect = (item) => {
    setSelectedItem(item);
    setSearchTerm(item); // Update search term to selected item
    getvalue(item);
    setIsDropdownOpen(false); // Close dropdown after selecting
  };

  return (
    <div className="relative w-full">
      {/* Input Field for Search */}
      <div className="relative w-full">
  {/* Search Icon */}
  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <i className="fas fa-search text-white"></i> {/* Using FontAwesome for the search icon */}
  </span>
  
  {/* Input Field */}
  <input
    type="text"
    placeholder={PLACEHOLDER}
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onFocus={() => setIsDropdownOpen(true)} // Open dropdown when input is focused
    className="border-b-2 border-black bg-transparent text-white"
    style={{color:'white'}}
  />
</div>


      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <ul className="absolute z-10 w-full bg-white border  rounded-lg mt-1 max-h-60 overflow-auto shadow-lg">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item)}
                className="cursor-pointer p-2 hover:bg-cyan-100 text-black"
              >
                {item}
              </li>
            ))
          ) : (
            <li className="p-2 text-white">No items found</li>
          )}
        </ul>
      )}
    </div>
  );
}
