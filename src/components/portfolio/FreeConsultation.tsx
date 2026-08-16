
import { CalendarDays, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const FreeConsultation = () => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);

  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    const openAndClose = () => {
      setExpanded(true);

      closeTimeoutRef.current = setTimeout(() => {
        setExpanded(false);
      }, 3000);
    };

    const initialTimeout = setTimeout(() => {
      openAndClose();
    }, 1500);

    
    const interval = setInterval(() => {
      openAndClose();
    }, 7000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);

      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="
        fixed
        bottom-4
        right-4
        z-[9999]
        sm:bottom-5
        sm:right-5
      "
    >
      <div className="relative">
     
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="
            absolute
            -right-1
            -top-1
            z-20
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-full
            border
            border-blue-200
            bg-white
            text-blue-800
            shadow-md
            transition
            hover:scale-110
            dark:border-blue-800
            dark:bg-blue-950
            dark:text-white
          "
          aria-label="إغلاق الاستشارة المجانية"
        >
          <X className="h-3.5 w-3.5" />
        </button>


        <span
          className="
            pointer-events-none
            absolute
            inset-0
            rounded-full
            bg-blue-600
            opacity-30
            animate-ping
            dark:bg-white
          "
        />


        <a
          href="https://wa.me/213795065655"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="حجز استشارة مجانية"
          className={`
            relative
            flex
            items-center
            overflow-hidden
            rounded-full
            bg-blue-600
            text-white
            shadow-xl
            transition-all
            duration-700
            ease-in-out
            hover:scale-105
            hover:bg-blue-700
            hover:shadow-2xl
            dark:bg-white
            dark:text-blue-900
            dark:hover:bg-blue-50

            ${
              expanded
                ? "gap-2 px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-3"
                : "h-12 w-12 justify-center sm:h-14 sm:w-14"
            }
          `}
        >

          <div
            className={`
              flex
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white/20
              transition-all
              duration-500
              dark:bg-blue-900/10

              ${
                expanded
                  ? "h-8 w-8 sm:h-9 sm:w-9"
                  : "h-9 w-9 sm:h-10 sm:w-10"
              }
            `}
          >
            <CalendarDays
              className="
                h-4 w-4
                sm:h-5 sm:w-5
              "
            />
          </div>


          <div
            className={`
              overflow-hidden
              whitespace-nowrap
              transition-all
              duration-500

              ${
                expanded
                  ? "max-w-[155px] opacity-100 sm:max-w-[180px]"
                  : "max-w-0 opacity-0"
              }
            `}
          >
            <p
              className="
                text-xs
                font-bold
                sm:text-sm
              "
            >
              استشارة مجانية 
            </p>

            <p
              className="
                text-[10px]
                opacity-90
                sm:text-xs
              "
            >
              30 دقيقة - احجز الآن
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default FreeConsultation;
