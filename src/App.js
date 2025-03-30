import React, { useState, useEffect } from "react";
import './App.css'; // Poprawny import pliku CSS

const KLUCZ_API = "49609126-94ba6cbc926165059a77973b0"; 
const KATEGORIE = ["samochody", "natura", "zwierzęta"];
const INNE_KATEGORIE = [
  "technologia", "jedzenie", "zwierzęta", "sport", "podróże", 
  "fitness", "moda", "architektura", "historia", "miasto", 
  "biznes", "muzyka", "kosmos", "sztuka", "edukacja", 
  "zdrowie", "nauka", "pojazdy", "gry", "rozrywka"
];

export default function Galeria() {
  const [wybranaKategoria, ustawWybranaKategoria] = useState(KATEGORIE[0]);
  const [zdjecia, ustawZdjecia] = useState([]);
  const [zdjecieDoPowiekszenia, ustawZdjecieDoPowiekszenia] = useState(null);
  const [losowaKategoria, ustawLosowaKategoria] = useState("");

  useEffect(() => {
    const pobierzZdjecia = async () => {
      const page = Math.floor(Math.random() * 20) + 1;
      
      try {
        const odpowiedz = await fetch(
          `https://pixabay.com/api/?key=${KLUCZ_API}&q=${encodeURIComponent(wybranaKategoria)}&image_type=photo&per_page=9&page=${page}&lang=pl`
        );
        
        if (!odpowiedz.ok) {
          throw new Error(`Błąd podczas pobierania zdjęć: ${odpowiedz.status}`);
        }

        const dane = await odpowiedz.json();
        ustawZdjecia(dane.hits || []);
      } catch (error) {
        console.error(error);
      }
    };
    pobierzZdjecia();
  }, [wybranaKategoria]);

  const losujKategorii = () => {
    const losowaKategoria = INNE_KATEGORIE[Math.floor(Math.random() * INNE_KATEGORIE.length)];
    ustawWybranaKategoria(losowaKategoria);
    ustawLosowaKategoria(losowaKategoria);
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Galeria zdjęć</h2>

      <div className="d-flex justify-content-center mb-3">
        {KATEGORIE.map((kategoria) => (
          <button
            key={kategoria}
            className={`btn ${wybranaKategoria === kategoria ? "btn-dark" : "btn-outline-dark"} mx-1`}
            onClick={() => {
              ustawWybranaKategoria(kategoria);
              ustawLosowaKategoria("");
            }}
          >
            {kategoria}
          </button>
        ))}
        <button
          className="btn btn-outline-primary mx-1"
          onClick={losujKategorii}
        >
          Losuj kategorię
        </button>
      </div>

      {(losowaKategoria || wybranaKategoria) && (
        <div className="text-center mb-3">
          <h4>Aktualnie wybrana kategoria: <strong>{losowaKategoria || wybranaKategoria}</strong></h4>
        </div>
      )}

      <div className="row">
        {zdjecia.map((zdjecie) => (
          <div key={zdjecie.id} className="col-md-4 mb-3">
            <div 
              style={{
                width: "100%", 
                height: "250px", 
                overflow: "hidden", 
                position: "relative",
                border: "1px solid #ddd", 
                borderRadius: "8px", 
              }}
            >
              <img
                src={zdjecie.webformatURL}
                alt={zdjecie.tags}
                className="img-fluid"
                style={{ 
                  objectFit: "cover", 
                  width: "100%",
                  height: "100%",
                  transition: "transform 0.2s ease-in-out"
                }}
                onClick={() => ustawZdjecieDoPowiekszenia(zdjecie)}
                onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              />
            </div>
          </div>
        ))}
      </div>

      {zdjecieDoPowiekszenia && (
        <div 
          style={{
            position: "fixed", 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: "rgba(0, 0, 0, 0.8)", 
            zIndex: 1000, 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center"
          }}
          onClick={() => ustawZdjecieDoPowiekszenia(null)}
        >
          <img
            src={zdjecieDoPowiekszenia.largeImageURL}
            alt={zdjecieDoPowiekszenia.tags}
            style={{ 
              maxHeight: "90%", 
              maxWidth: "90%", 
              objectFit: "contain",
              border: "2px solid #fff",
              borderRadius: "8px"
            }}
          />
        </div>
      )}
    </div>
  );
}
