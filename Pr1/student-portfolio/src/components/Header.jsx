function Header({ name, themeColor }) {
    return (
        <header className="header">
            <h1 style={{ color: themeColor }}>{name}</h1>
            <p>Aspiring Full Stack Developer</p>
        </header>
    );
}
export default Header;