import React, { useState, useEffect } from "react";
import "./App.css";

const WEBHOOK_URL =
  "https://autocomjapan.bitrix24.com/rest/644/uqiau78dkqfyzvw9/";

  const App = () => {
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [partners, setPartners] = useState([]);
  
    // Получение данных из Bitrix24
    useEffect(() => {
      const fetchRegions = async () => {
        try {
          const response = await fetch(
            `${WEBHOOK_URL}lists.section.get?IBLOCK_TYPE_ID=lists&IBLOCK_ID=97`
          );
          const data = await response.json();
          if (data.result) {
            setRegions(data.result);
          }
        } catch (error) {
          console.error("Error fetching regions:", error);
        }
      };
  
      fetchRegions();
    }, []);
  
    // Обработка выбора региона
    const handleRegionChange = async (e) => {
      const regionId = e.target.value;
      setSelectedRegion(regionId);
  
      try {
        const response = await fetch(
          `${WEBHOOK_URL}lists.element.get?IBLOCK_TYPE_ID=lists&IBLOCK_ID=97&FILTER[SECTION_ID]=${regionId}`
        );
        const data = await response.json();
        if (data.result) {
          const shuffled = data.result.sort(() => 0.5 - Math.random());
          setPartners(shuffled.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };
  
    return (
      <div className="app-container">
        <h1 className="app-title">Найдите партнёра в вашем регионе</h1>
        <div className="dropdown-container">
          <select
            className="dropdown"
            value={selectedRegion}
            onChange={handleRegionChange}
          >
            <option value="" disabled>
              Выберите регион
            </option>
            {regions.map((region) => (
              <option key={region.ID} value={region.ID}>
                {region.NAME}
              </option>
            ))}
          </select>
        </div>
  
        {partners.length > 0 && (
          <div className="partners-container">
            <h2 className="partners-title">Список партнёров</h2>
            <div className="cards-container">
              {partners.map((partner) => (
                <div key={partner.ID} className="card">
                  <h3 className="card-title">{partner.NAME}</h3>
                  <p className="card-description">
                    <strong>Описание:</strong> {partner.PREVIEW_TEXT}
                  </p>
                  {partner.PROPERTY_891 && (
                    <p>
                      <strong>Сайт:</strong>{" "}
                      <a
                        href={Object.values(partner.PROPERTY_891)[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-link"
                      >
                        {Object.values(partner.PROPERTY_891)[0]}
                      </a>
                    </p>
                  )}
                  {partner.PROPERTY_893 && (
                    <p>
                      <strong>Город:</strong>{" "}
                      {Object.values(partner.PROPERTY_893)[0]}
                    </p>
                  )}
                  {partner.PROPERTY_895 && (
                    <p>
                      <strong>Доставка:</strong>{" "}
                      {Object.values(partner.PROPERTY_895)[0]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default App;
