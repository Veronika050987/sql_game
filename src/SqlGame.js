import React, { useState } from 'react';
import './SqlGame.css';


const translations = {
  "Уровень 1: DDL" : "Level 1: DDL",
  "Уровень 2: DML" : "Level 2: DML",
  "Уровень 3: DQL" : "Level 3: DQL",
  "Режим строителя: DDL (создаём гараж для машинок)" : "Builder mode: DDL (create cars garage)",
  "Твоя задача - управлять зданиями. Построй гараж для будущих машин!" : "Your task is to manage the buildings. Build a garage for the future cars.",
  "Здесь пусто. Нажми CREATE, чтобы построить гараж!" : "Empty! Push CREATE  to build a garage!",
  "Режим управления: DML (управляем тем, что внутри)" : "Manager mode: DML (manage inside the garage)",
  "Гараж готов! Теперь будем командовать машинками внутри него." : "The garage is ready. Now we will manage the cars inside it.",
  "Внутри твоего гаража:" : "Inside your garage",
  "Гараж пуст. Нажми INSERT, чтобы припарковать машинку!" : "The garage is empty. Push INSERT to park a car!",
  "Ой! Сначала вернись на Уровень 1 и создай (CREATE) гараж!" : "Oups! Return into level 1 and create (CREATE) a garage!",
  "Режим поиска: DQL (ищем объекты в гараже)" : "Search mode in the garage: DDL (search the objects in the garage)",
  "ГАРАЖ" : "GARAGE",
  "SELECT * FROM garage (Показать всё)" : "SELECT * FROM garage (Show all)",
  "SELECT FROM garage WHERE color = 'синий'" : "SELECT FROM garage WHERE color = 'blue'",
  "Используй команду SELECT и мощный фонарик, чтобы отфильтровать нужные объекты." : "Use a SELECT command and a powerful lantern to filter useful objects.",
  "Фонарик ничего не нашёл! (Убедись, что на 2 уровне ты добавил синие машинки)" : "The lantern found nothing. Make sure that you've added cars at level 2.",
  "Сначала нужно построить гараж на Уровне 1." : "At first you need to build a garage at level 1."

}

export default function SqlGame() {
  const [isEnglish, setIsEnglish] = useState(false);

  const t = (text) => (isEnglish && translations[text] ? translations[text] : text);

  const [level, setLevel] = useState(1); // Текущий уровень (1, 2, 3)
  
  // Состояния для Уровня 1 (DDL)
  const [hasGarage, setHasGarage] = useState(false);
  const [garageColor, setGarageColor] = useState('#718096'); // серый базовый
  const [hasGarageHandles, setHasGarageHandles] = useState(false);
  const [isExploding, setIsExploding] = useState(false);

  // Состояния для Уровня 2 (DML)
  // Машинки хранятся в виде объектов: { id, color, hasNewLights }
  const [cars, setCars] = useState([
    { id: 1, color: '#e53e3e', hasNewLights: false }, // красная базовая
  ]);

  // Состояния для Уровня 3 (DQL)
  const [searchQuery, setSearchQuery] = useState('ALL'); // 'ALL' или 'BLUE'

  // --- ЛОГИКА УРОВНЯ 1: DDL ---
  const handleCreate = () => {
    setHasGarage(true);
    setGarageColor('#718096');
    setHasGarageHandles(false);
  };

  const handleAlter = () => {
    if (!hasGarage) return;
    setGarageColor('#3182ce'); // Красим в синий
    setHasGarageHandles(true);  // Добавляем крутые ручки
  };

  const handleDrop = () => {
    if (!hasGarage) return;
    setIsExploding(true);
    setTimeout(() => {
      setHasGarage(false);
      setIsExploding(false);
      setCars([]); // Если гараж удален, машинки тоже исчезают
    }, 600);
  };

  // --- ЛОГИКА УРОВНЯ 2: DML ---
  const handleInsert = () => {
    if (cars.length >= 5) return; // Ограничим вместимость для красоты
    const colors = ['#48bb78', '#3182ce', '#ecc94b']; // зеленый, синий, желтый
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newCar = {
      id: Date.now(),
      color: randomColor,
      hasNewLights: false
    };
    setCars([...cars, newCar]);
  };

  const handleUpdate = () => {
    // Включаем супер-неоновые фары всем машинкам в гараже
    setCars(cars.map(car => ({ ...car, hasNewLights: true })));
  };

  const handleDelete = () => {
    if (cars.length === 0) return;
    // Удаляем последнюю машинку (выкидываем в мусорку)
    setCars(cars.slice(0, -1));
  };

  // --- ФИЛЬТРАЦИЯ ДЛЯ УРОВНЯ 3: DQL ---
  const displayedCars = searchQuery === 'BLUE' 
    ? cars.filter(car => car.color === '#3182ce') 
    : cars;

  return (
    <div className="sql-game">
      <button className='language' onClick={() => setIsEnglish(!isEnglish)}>
                {isEnglish ? "Русский" : "English"}
            </button>
      {/* Шапка с переключением уровней */}
      <div className="level-tabs">
        <button className={level === 1 ? 'active' : ''} onClick={() => setLevel(1)}>🧱 {t('Уровень 1: DDL')}</button>
        <button className={level === 2 ? 'active' : ''} onClick={() => setLevel(2)}>🚐 {t('Уровень 2: DML')}</button>
        <button className={level === 3 ? 'active' : ''} onClick={() => setLevel(3)}>🔍 {t('Уровень 3: DQL')}</button>
      </div>

      {/* Экран игры */}
      <div className="game-screen">
        
        {/* УРОВЕНЬ 1: DDL */}
        {level === 1 && (
          <div className="level-content">
            <h2>{ t('Режим строителя: DDL (создаём гараж для машинок)')}</h2>
            <p className="task-desc">{t('Твоя задача - управлять зданиями. Построй гараж для будущих машин!')}</p>
            
            <div className="control-panel">
              <button className="btn-sql btn-create" onClick={handleCreate}>CREATE</button>
              <button className="btn-sql btn-alter" disabled={!hasGarage} onClick={handleAlter}>ALTER</button>
              <button className="btn-sql btn-drop" disabled={!hasGarage} onClick={handleDrop}>DROP</button>
            </div>

            <div className="sandbox">
              {hasGarage ? (
                <div 
                  className={`garage-building ${isExploding ? 'explode' : ''}`} 
                  style={{ backgroundColor: garageColor }}
                >
                  <div className="garage-roof"></div>
                  <div className="garage-door">
                    {hasGarageHandles && (
                      <>
                        <div className="door-handle left">⭐</div>
                        <div className="door-handle right">⭐</div>
                      </>
                    )}
                    <span className="garage-sign">{t('ГАРАЖ')}</span>
                  </div>
                </div>
              ) : (
                <div className="empty-zone">{t('Здесь пусто. Нажми CREATE, чтобы построить гараж!')}</div>
              )}
            </div>
          </div>
        )}

        {/* УРОВЕНЬ 2: DML */}
        {level === 2 && (
          <div className="level-content">
            <h2>{t('Режим управления: DML (управляем тем, что внутри)')}</h2>
            <p className="task-desc">{t('Гараж готов! Теперь будем командовать машинками внутри него.')}</p>
            
            <div className="control-panel">
              <button className="btn-sql btn-insert" disabled={!hasGarage} onClick={handleInsert}>INSERT</button>
              <button className="btn-sql btn-update" disabled={!hasGarage || cars.length === 0} onClick={handleUpdate}>UPDATE</button>
              <button className="btn-sql btn-delete" disabled={!hasGarage || cars.length === 0} onClick={handleDelete}>DELETE</button>
            </div>

            <div className="sandbox">
              {hasGarage ? (
                <div className="garage-interior">
                  <h3>{t('Внутри твоего гаража:')}</h3>
                  <div className="cars-grid">
                    {cars.length > 0 ? (
                      cars.map(car => (
                        <div key={car.id} className="car-toy" style={{ backgroundColor: car.color }}>
                          <div className={`car-light left ${car.hasNewLights ? 'neon' : ''}`}></div>
                          <div className={`car-light right ${car.hasNewLights ? 'neon' : ''}`}></div>
                          <div className="car-wheel w1"></div>
                          <div className="car-wheel w2"></div>
                          🚗
                        </div>
                      ))
                    ) : (
                      <div className="empty-interior">{t('Гараж пуст. Нажми INSERT, чтобы припарковать машинку!')}</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="warning-zone">🛑 {t('Ой! Сначала вернись на Уровень 1 и создай (CREATE) гараж!')}</div>
              )}
            </div>
          </div>
        )}

        {/* УРОВЕНЬ 3: DQL */}
        {level === 3 && (
          <div className="level-content">
            <h2>{t('Режим поиска: DQL (ищем объекты в гараже)')}</h2>
            <p className="task-desc">{t('Используй команду SELECT и мощный фонарик, чтобы отфильтровать нужные объекты.')}</p>
            
            <div className="control-panel sql-select-panel">
              <button 
                className={`btn-sql btn-select ${searchQuery === 'ALL' ? 'active-select' : ''}`}
                onClick={() => setSearchQuery('ALL')}
              >
                {t('SELECT * FROM garage (Показать всё)')}
              </button>
              <button 
                className={`btn-sql btn-select ${searchQuery === 'BLUE' ? 'active-select' : ''}`}
                onClick={() => setSearchQuery('BLUE')}
              >
                {t("SELECT FROM garage WHERE color = 'синий'")}
              </button>
            </div>

            <div className="sandbox">
              {hasGarage ? (
                <div className="flashlight-zone">
                  <div className="cars-grid">
                    {displayedCars.length > 0 ? (
                      displayedCars.map(car => (
                        <div key={car.id} className="car-toy detected" style={{ backgroundColor: car.color }}>
                          <div className={`car-light left ${car.hasNewLights ? 'neon' : ''}`}></div>
                          <div className={`car-light right ${car.hasNewLights ? 'neon' : ''}`}></div>
                          <div className="car-wheel w1"></div>
                          <div className="car-wheel w2"></div>
                          🚗
                        </div>
                      ))
                    ) : (
                      <div className="empty-interior">{t('Фонарик ничего не нашёл! (Убедись, что на 2 уровне ты добавил синие машинки)')}</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="warning-zone">🛑 {t('Сначала нужно построить гараж на Уровне 1.')}</div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
