import { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("");
    }
    alert("Successful Login!\nEmail: ${email}\nSenha: ${password}");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center h-screen bg-"
    >
      <div>
        <label htmlFor="email" className="">
          Email:
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className=""
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className=""
          required
        />
      </div>

      <div>
        <button type="submit" className="">
          Login
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
