export default function LoginPage() {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Login</h1>
  
        <form>
          <div>
            <label>Email</label>
            <input type="email" name="email" />
          </div>
  
          <div>
            <label>Senha</label>
            <input type="password" name="password" />
          </div>
  
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }
  