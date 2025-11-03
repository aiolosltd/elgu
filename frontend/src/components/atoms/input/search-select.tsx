// src/components/atoms/input/search-select.tsx
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface OptionType {
  value: string;
  label: string;
}

interface SearchSelectProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: OptionType[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
}

export const SearchSelect: React.FC<SearchSelectProps> = ({
  label,
  id,
  value,
  onChange,
  options,
  placeholder = "Select...",
  required = false,
  error,
  isLoading = false,
  isDisabled = false,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedOption = options.find(option => option.value === value);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onChange('');
    setSearchTerm('');
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className={cn(
              "w-full justify-between h-12 px-4 py-2",
              "bg-background border-input hover:bg-accent hover:text-accent-foreground",
              "focus:ring-2 focus:ring-ring focus:ring-offset-2",
              error && "border-destructive focus:ring-destructive",
              isDisabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={isDisabled}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {selectedOption ? (
                <span className="text-foreground truncate">{selectedOption.label}</span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            
            <div className="flex items-center gap-1 ml-2 shrink-0">
              {value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 hover:bg-transparent hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Clear selection</span>
                </Button>
              )}
              <ChevronDown 
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  isOpen && "rotate-180"
                )} 
              />
            </div>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-full p-0" 
          align="start"
          sideOffset={4}
        >
          <Command shouldFilter={false}>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <CommandInput
                placeholder="Search..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="h-11 border-0 focus:ring-0"
              />
            </div>
            
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                {isLoading ? "Loading..." : "No options found."}
              </CommandEmpty>
              
              <CommandGroup>
                <ScrollArea className="h-48">
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
                        "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <div className={cn(
                        "flex items-center gap-2 w-full",
                        option.value === value && "font-semibold"
                      )}>
                        <div className={cn(
                          "h-4 w-4 rounded-sm border border-primary",
                          option.value === value 
                            ? "bg-primary text-primary-foreground" 
                            : "opacity-50"
                        )}>
                          {option.value === value && (
                            <div className="flex items-center justify-center h-full w-full">
                              <div className="h-2 w-2 rounded-sm bg-primary-foreground" />
                            </div>
                          )}
                        </div>
                        <span className="flex-1">{option.label}</span>
                      </div>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {error && (
        <p className="text-sm font-medium text-destructive flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
};