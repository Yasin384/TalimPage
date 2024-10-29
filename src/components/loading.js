import '../cssComponents/loading.css';

function LoadingPage() {
    // Generate an array of snowflake elements
    const snowflakes = Array.from({ length: 50 }, (_, i) => (
        <div
            key={i}
            className="snowflake"
            style={{
                left: `${Math.random() * 100}vw`,  // Random horizontal start position
                animationDuration: `${Math.random() * 3 + 2}s`,  // Random fall speed
                fontSize: `${Math.random() * 10 + 10}px`  // Random size for each snowflake
            }}
        >
            ❄
        </div>
    ));

    return (
        <div className="LoadingPage">
            <div className="loading">
                
                <div className="loadingCheck"></div>
                <p id='inter-regular-font2'>Загрузка...</p>
            </div>
            {snowflakes}
        </div>
    );
}

export default LoadingPage;
