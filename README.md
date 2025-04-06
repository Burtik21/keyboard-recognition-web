## Měřič efektivnosti programování

Tento projekt se zaměřuje na klasifikaci zvuku, přesněji zvuku klávesnice. Jeho cílem je počítat klikání na klávesnici.
Nejvíce jsem se orientoval podle spektrogramu  
![image](https://github.com/user-attachments/assets/a801a840-0524-45e8-bfe7-0fa19546db25)

## Funkce
-  Real time **Záznam zvuku**
- **Detekce klávesových stisků**: Aplikace analyzuje zvukové vzory generované při stisku klávesy
- **Interaktivní uživatelské rozhraní**: Webová aplikace poskytuje jednoduché uživatelské rozhraní pro zahájení a zastavení záznamu.
- **Podpora pro různé zařízení**: Aplikace je navržena tak, aby fungovala ve i na mobilních zařízení bez nutnosti instalace jakýchkoliv dalších pluginů.

## Real time nahrávání
### Raspberry Pi
- s real time nahráváním jsem měl velké potíže, jako první myšlenka byla nahrávání zvuku přes Raspberry Pi,  
  bohužel kvůli špatné zvukové kartě se zvuk špatně rozpoznával.
- měl jsem už koupený USB mikrofon a redukci na USB micro a dokonce i vytisknutý držák  
![image](https://github.com/user-attachments/assets/cadc4ff7-a627-4a2b-a5a3-3b1cb3c3f965)

### Mobil a Websockety
- další nápad byl, že bych zvuk nahrával přes mobil a výsledek bych viděl na PC. to vše přes webovou aplikací
- tento nápad také nevyšel, kvůli špatnému formátu, ve kterém se zvuk nahrával a následná konverze.
### Rozkrajování na sekundové kousky
- nakonec jsem se rozhodl pro své řešení
- Uživatel zapne nahrávání, to se po každe sekundě vypne znovu zapne, aniž by uživatel poznal, že se něco stalo
- Každý jeden tento sekundový záznam (chunk), který je ve formátuz WEBM, následně samostatně konverzuju na WAV, kvůli malé podpoře WEBM konvertorů,
  a posílám na endpoint kde se chunk analyzuje a vrátí počet kliknutí

## Detekce klávesy
### Algoritmus na detekci výraznějšího zvuku
- Pro detekci stisknutí klávesy v reálném čase používáme metodu **RMS (Root Mean Square)**. RMS je matematický nástroj pro výpočet průměrné energie signálu v daném časovém intervalu (23ms - 1 frame).   Tento výpočet nám umožňuje detekovat intenzitu zvukového signálu, což je užitečné pro rozpoznávání zvukových vzorců vznikajících při stisku klávesy.
- tam kde RMS přesáhne práh, a to okolo 0.005, tam začne nahrávání segmentu a skončí tam, kde RMS zase klesne pod tuto hodnotu. Tímto se vykousne segment kde se odehrál daný event, a to třeba kliknutí.
- Narazil jsem na problém a to takový, že kliknutí jsou 2 zvuky - zmáčknutí a odmáčknutí -> přidání cooldownu 0.12 sekundy než znovu můžeme detekovat něco.
- ![image](https://github.com/user-attachments/assets/cb5f969b-204e-48c6-8920-9bda2dab6775)

### Parametry zvuků
  #### RMS (Root Mean Square)
  - Co to je: RMS je statistická metoda pro výpočet průměrné velikosti signálu. V kontextu zvuku měří průměrnou amplitudu (hlasitost) signálu v daném časovém období
  - Proč ji máme: RMS je klíčové pro měření intenzity zvuku. Umožňuje detekovat, jak silný je zvuk v daném časovém úseku, což je užitečné pro detekci stisknutí klávesy, protože klikání na klávesy generuje krátké a silné zvukové události
  #### ZCR (Zero Crossing Rate)
  - Co to je: ZCR je počet změn znaménka signálu za sekundu. Jinými slovy, měří, kolikrát signál přechází z kladného na záporný a naopak
  - Proč to máme: Rychlé změny signálu (např. při kliknutí na klávesu) budou mít vysoký ZCR. Pomáhá identifikovat rychlé změny ve zvuku, které jsou typické pro krátké, rychlé zvuky
  #### Spectral Centroid
  - Co to je: Spectral centroid určuje, kde se nachází střed frekvenčního spektra. Vyjadřuje jaký druh zvuku je: jasnější (vyšší centroid) nebo tmavší (nižší centroid)
  - Proč to máme: Vyšší hodnoty spectral centroidu znamenají zvuky s vyššími frekvencemi (např. jasné zvuky), což může být užitečné pro detekci zvuků kliknutí na klávesu, která obsahuje větší podíl vysokých frekvencí
  #### Spectral Bandwidth
  - Co to je: Spectral bandwidth měří, jak široké je rozdělení frekvenčního spektra. Jinými slovy, ukazuje, jak rozptýlené jsou frekvence v daném zvuku
  - Proč ji máme: Vysoká spectral bandwidth je obvykle spojena s ostřejšími zvuky, zatímco nízká spectral bandwidth ukazuje na úzké, basové frekvence.  Tento parametr může pomoci při odlišení zvuků, které jsou ostré a rychlé, což může být užitečné pro detekci klávesy
  #### Spectral Rolloff
  - Co to je: Spectral rolloff určuje práh, nad kterým jsou považovány frekvence za významné ve spektru zvuku. V podstatě jde o frekvenční bod, pod nímž je považováno 85% (nebo jiný parametr) spektra za "tiché"
  - Proč ji máme: Spectral rolloff je často používaný k rozeznání výrazných zvuků (kliknutí na klávesu). Když klikneš na klávesu, spektrum je typicky složeno z vyšších frekvencí, což zvyšuje rolloff hodnotu.
  #### Max Intensity
  - Co to je: Max intensity je maximální amplituda signálu v daném časovém úseku
  - Proč ji máme: Tento parametr ukazuje, jak silný je zvuk v největším bodě signálu. Pokud RMS představuje průměrnou intenzitu, max intensity ukazuje na nejvýraznější momenty zvuku, které mohou odpovídat klávesovému stisku
  #### Dominant Frequency
  - Co to je: Dominant frequency je dominantní frekvence
  - Proč ji máme: Pomáhá nám identifikovat klíčovou frekvenci v signálu, která může být spojená s konkrétním zvukem, jako je stisknutí určité klávesy na klávesnici
  #### Duration (doba)
  - Co to je: Duration je délka zvukového signálu, tedy časový interval, po který trvá určitý zvuk. Většinou okolo 0.03 sekundy
  - roč ji máme: Délka trvání signálu může být užitečná pro rozlišování mezi krátkými zvuky, jako je kliknutí na klávesu, a delšími zvuky, jako je šum nebo hlas
  #### MFCC (Mel-frequency cepstral coefficients) - různé matematické výpočty pro různé frekvence
  - Co to je: MFCC jsou koeficienty, které reprezentují spektrum zvuku v rámci mel-frekvenční škály. MFCC jsou velmi užitečné pro rozpoznávání řeči a audio klasifikaci, protože reprezentují způsob, jakým lidské ucho vnímá zvuky.
  - Proč je máme: MFCC jsou velmi důležité pro klasifikaci zvukových vzorců. Pro detekci klávesy jsou užitečné, protože každý klávesový stisk bude mít specifický vzorec ve frekvenčním spektru, který se může odlišovat od jiných zvuků (např. hučení nebo pozadí).
    - MFCC_1 až MFCC_13 (nebo jiné hodnoty) jsou jednotlivé koeficienty, které reprezentují různé aspekty spektra zvuku.
    - Například MFCC_1 představuje nejnižší mel-frekvenci, zatímco MFCC_13 se zaměřuje na vysoké frekvence.

## Testování
### Cíle testování
- Zjištění přesnosti detekce klávesy: Jak dobře dokáže systém detekovat stisknutí klávesy, bez ohledu na rozdílné typy klávesnic a mikrofonů.
- Stabilita systému: Jak stabilní je detekce na různých typech hardware (klávesnice, mikrofony).
### Testovací Hardware
- Pro nejlepší výsledky jsem testoval a sbíral data na různém hardwaru a to:
- Klávesnice membránové
    - LOGITECH G213
    - Školní: Starší Genius
    - Školní: Novější genius
    - Školní: Velice stará logitech  


![image](https://github.com/user-attachments/assets/dd1002d0-74f9-4977-93f3-05c203afa7c1)

- Mikrofony
    - Samsung S22+
    - Samsung A51
    - Sluchátkový mikrofon ORYX X600
    - Malý USB mikrofon, původně na RPI
#### Výsledky

| Klávesnice               | Mikrofon (hlavní záměr - mobil) | Úspěšnost detekce (v %) | Falešně pozitivní (z 10) | Falešně negativní (v %) | 
|--------------------------|---------------------------------|-------------------------|-------------------------|-------------------------|
| LOGITECH G213            | Samsung S22+                    | 90                      | 1                       | 1                       |                              
| Starší Genius            | Samsung S22+                    | 75                      | 1                       | 1                       |                              
| Novější Genius           | Samsung S22+                    | 65                      | 0                       | 0                       |                              
| Velice stará Logitech    | Samsung S22+                    | 85                      | 1                       | 1                       |                              
                                     
## Technologie

### EJS (Embedded JavaScript)
- **Co to je**: **EJS** je **šablonovací jazyk** pro **Node.js**, který umožňuje dynamické generování HTML na serveru. EJS používá JavaScript pro vykreslování HTML šablon a poskytuje možnost **vkládat** proměnné přímo do HTML.
- **Proč používáme**: EJS je použit pro **generování HTML stránek** na serveru, což umožňuje flexibilní zobrazení obsahu na základě dat. V tomto projektu slouží pro renderování šablon (např. zobrazení aplikace, výsledků detekce, atd.).
  
### Nginx
- **Co to je**: **Nginx** je **webový server** a **reverse proxy server** používaný pro efektivní správu a distribuci webového provozu. Nginx je známý svou **vysokou výkonností** a schopností obsluhovat tisíce požadavků současně.
- **Proč používáme**: Nginx je použit jako **reverse proxy server** pro směrování požadavků z **externího internetu** na interní server aplikace běžící na **Node.js**. Tento nástroj zajišťuje také obsluhu **statických souborů** (CSS, JS, obrázky) a efektivně distribuuje zátěž mezi servery. 
  - **SSL/TLS šifrování**: Nginx může sloužit k **šifrování komunikace** pomocí **HTTPS**.

### JavaScript - Node.js, Express.js
- **Co to je**:
  - **Node.js** je **JavaScriptová runtime prostředí**, které umožňuje spouštět JavaScript na serveru. Node.js je ideální pro aplikace, které potřebují **rychlé** a **asynchronní zpracování** dat.
  - **Express.js** je webový framework pro Node.js, který zjednodušuje práci s HTTP požadavky, směrováním a middleware.
- **Proč používáme**:
  - **Node.js** je skvělý pro **real-time aplikace**, jako je ta naše, která pracuje s **WebSocket** pro detekci stisknutí klávesy a odesílání dat v reálném čase.
  - **Express.js** poskytuje flexibilní a jednoduchý způsob, jak nastavit **API**, směrovat požadavky a obsluhovat **statické soubory**. Je to ideální volba pro **backend** webové aplikace.

### Python - Flask
- **Co to je**: **Flask** je **mikro-webový framework** pro Python. Flask je navržen tak, aby byl **jednoduchý** a **flexibilní**, což umožňuje rychlé vytváření webových aplikací.
- **Proč používáme**: V tomto projektu je **Flask** použit pro určité části **analýzy zvuku** a **strojového učení** (např. zpracování audio dat, analýza pomocí **MFCC**, **RMS**, a dalších metod). Flask je vhodný pro **API služby**, které mohou komunikovat s hlavní aplikací v Node.js.

### Další knihovny a nástroje
- **Librosa**: Knihovna pro **extrakci zvukových vlastností** z audio signálů, jako je **Zero Crossing Rate (ZCR)**, **MFCC** a další parametry, které pomáhají v analýze zvuků.

### MVC struktura
- 


## Nasazení
- **Klonování repozitáře**: První krok je naklonování repozitáře, což se dělá přes `git clone`
   - git clone https://github.com/Burtik21/keyboard-recognition-web.git
   - git clone https://github.com/Burtik21/record-sound.git
- **Instalace závislostí**: Poté se nainstalují všechny závislosti potřebné pro běh aplikace.
   - v node - npm install
   - v pythonu - pip install
- **Konfigurace .env**: Nastavení databáze a dalších proměnných prostředí.
   - DB_HOST=localhost
   - DB_PORT=3306
   - DB_NAME=tvoja_databaze
   - DB_USER=tvoje_uzivatelske_jmeno
   - DB_PASSWORD=tvoje_heslo
   - PORT=port node aplikace
   - PORT_PYTHON=port python aplikace
- **HTTPS a doména**
   - Pro nahrávání zvuku z mikrofonu je nutné mít server, který podporuje **HTTPS**. To je vyžadováno **Web Audio API**.
- **Základní konfigurace pro Nginx**
   - Nginx bude sloužit jako proxy server pro směrování požadavků na backendovou aplikaci běžící na **Node.js** (např. na portu **5500**). Pro zajištění **HTTPS** je potřeba nastavit SSL certifikáty.

## Spuštění
- Aplikace je nasazena na https://sajmiho.lol/auth/register

## Použitý kód z předchozího projektu

Tento projekt využívá některé části kódu z předchozího projektu:
- **Předchozí projekt**:(https://github.com/Burtik21/library-orm
- Použitý kód:
   - Celá registrace - https://github.com/Burtik21/library-orm/blob/master/controllers/authController.js
   - Celé přihlášení - https://github.com/Burtik21/library-orm/blob/master/controllers/authController.js
   - Spravování účtů - https://github.com/Burtik21/library-orm/blob/master/controllers/accController.js
   - Struktura projektu a připojení k databázi
 ## Data
 - https://github.com/Burtik21/keyboard-data
  

 
