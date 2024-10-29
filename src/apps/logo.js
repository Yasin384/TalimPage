import '../cssFiles/contacts.css'

const contactInfo = {
    number1Phone: '+996 507 339 199',
    number2Phone: '+996 559 99 56 05',

    telegram: 'riqqay',
    telegramChannel: 'amaiiateam'
}
export const LogoAndContacts = () => {
    return (
        <div className="contacts">
            <div className='main-logo' id='inter-font2'>
                <img className='iconGit' src='/imgs/iconOur.png' alt='olo'/>
                <p className='logo-n-text' id=''>Amaiia</p>
            </div>
            <div className='meta-info' id='inter-light-font2'>
                <p>{contactInfo.number1Phone}</p>
                <p>{contactInfo.number2Phone}</p>
                <a href={`t.me/${contactInfo.telegram}`}>Telegram: t.me/{contactInfo.telegram}</a>
                <a href={`t.me/${contactInfo.telegramChannel}`}>Telegram Channel: t.me/{contactInfo.telegramChannel}</a>
            </div>
            <div className='legs'>
                <p id='inter-font2'>Made by Amaiia CO</p>
            </div>
        </div>
    )
}