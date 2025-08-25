import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import companyLogo from "../../images/logo/logo.svg";

interface ScreensaverProps {
  isActive: boolean;
  onDismiss: () => void;
}

const Screensaver: React.FC<ScreensaverProps> = ({ isActive, onDismiss }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isActive) return;

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const moveInterval = setInterval(() => {
      setPosition({
        x: Math.random() * (window.innerWidth - 400),
        y: Math.random() * (window.innerHeight - 200),
      });
    }, 3000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(moveInterval);
    };
  }, [isActive]);

  const handleClick = () => {
    onDismiss();
  };

  if (!isActive) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black cursor-pointer"
      onClick={handleClick}
      onKeyDown={(e) => e.key && handleClick()}
      tabIndex={0}
    >
      {/* Floating Logo and Company Name */}
      <motion.div
        className="absolute"
        animate={{ x: position.x, y: position.y }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <img src={companyLogo} className="w-80 h-80 mb-4 opacity-80" />
      </motion.div>
      {/* Clock */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="text-center text-white">
          <div className="text-6xl md:text-8xl font-thin mb-4">
            {currentTime.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          <div className="text-xl md:text-2xl opacity-80">
            {currentTime.toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <p className="text-white opacity-60 text-sm text-center">
          Klik di mana saja atau tekan tombol apa pun untuk melanjutkan
        </p>
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Screensaver;
