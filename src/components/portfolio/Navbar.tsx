import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const navItems = [
    { key: "home", href: "#home" },
    { key: "about", href: "#about" },
    { key: "services", href: "#services" },
    { key: "skills", href: "#skills" },
    { key: "projects", href: "#portfolio" },
    { key: "contact", href: "#contact" },
  ];

  const renderControls = () => (
    <div className="flex items-center gap-1 bg-gray-100/80 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-full p-1 backdrop-blur-md transition-colors duration-300 w-fit">
      <div className="flex items-center">
        <button
          onClick={() => i18n.changeLanguage("en")}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
            i18n.language === "en"
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          English
        </button>

        <button
          onClick={() => i18n.changeLanguage("ar")}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
            i18n.language === "ar"
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          العربية
        </button>
      </div>

      <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

      <button
        onClick={toggleTheme}
        className="p-2 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700/50 transition-all duration-300"
        aria-label="Toggle Dark Mode"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        )}
      </button>
    </div>
  );

  return (
    <nav
      dir="ltr"
      className="fixed top-0 w-full bg-gray-200/50 dark:bg-blue-900/20 backdrop-blur-lg border-b border-gray-300/50 dark:border-blue-400/20 z-50 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-black dark:text-white transition-colors duration-300">
            Younes Aid
          </div>

          {/* Desktop Navigation */}
          <div
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
            className="hidden md:flex gap-8 items-center"
          >
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="text-gray-600 dark:text-gray-300 hover:text-black hover:dark:text-white transition-colors duration-200"
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
          </div>

          <div className="hidden md:flex">
            {renderControls()}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-black dark:text-white hover:bg-gray-300/50 dark:hover:bg-white/10"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="md:hidden animate-fade-in">
            <div 
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
              className="px-2 pt-2 pb-4 space-y-2 sm:px-3 bg-white/90 dark:bg-black/40 backdrop-blur-md rounded-lg mb-4 shadow-lg border border-gray-200 dark:border-white/10 transition-colors duration-300"
            >
              <div className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    className="block px-3 py-2 text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {t(`nav.${item.key}`)}
                  </a>
                ))}
              </div>

              <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700/50 flex justify-center">
           
                {renderControls()}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
