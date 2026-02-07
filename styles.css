:root{
  --turquoise: #27C7C7;
  --black: #000000;
  --gray: #222;
  --line: rgba(0,0,0,.14);
  --shadow: 0 10px 30px rgba(0,0,0,.12);
  --radius: 16px;
  --container: 1120px;
  --headerH: 72px;
}

*{ box-sizing: border-box; }
html, body { height: 100%; }
body{
  margin: 0;
  font-family: Helvetica, Arial, sans-serif;
  color: var(--black);
  background: #ffffff;
  line-height: 1.5;
}

a{ color: var(--black); }
a:hover{ text-decoration: underline; }

.vh-sr-only{
  position:absolute; width:1px; height:1px; padding:0; margin:-1px;
  overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;
}

/* Header */
.vh-header{
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--headerH);
  background: var(--turquoise);
  border-bottom: 1px solid rgba(0,0,0,.18);
}

.vh-header-inner{
  max-width: var(--container);
  height: 100%;
  margin: 0 auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: 1fr minmax(280px, 520px) 1fr;
  align-items: center;
  gap: 12px;
}

.vh-left{
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.vh-logo{
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  letter-spacing: .08em;
  text-decoration: none;
}

.vh-logo img{
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 0 0 2px rgba(0,0,0,.08);
}

.vh-nav{
  display: flex;
  align-items: center;
  gap: 10px;
}

.vh-nav a{
  text-decoration: none;
  color: #000;
  font-size: .95rem;
  padding: 10px 10px;
  border-radius: 12px;
}

.vh-nav a:hover{
  background: rgba(255,255,255,.40);
  text-decoration: none;
}

/* Burger (mobile) */
.vh-burger{
  display: none;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,.20);
  background: rgba(255,255,255,.35);
  cursor: pointer;
}

.vh-burger span{
  display:block;
  width: 18px;
  height: 2px;
  background: #000;
  margin: 4px auto;
  border-radius: 2px;
}

/* Search (centered) */
.vh-search{
  position: relative;
  width: 100%;
  justify-self: center;
}

.vh-search input{
  width: 100%;
  height: 44px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,.25);
  background: rgba(255,255,255,.90);
  color: #000;
  padding: 0 16px;
  outline: none;
}

.vh-search input:focus{
  border-color: rgba(0,0,0,.45);
  box-shadow: 0 0 0 3px rgba(255,255,255,.35);
}

.vh-search-suggestions{
  position: absolute;
  left: 0;
  right: 0;
  top: 48px;
  display: none;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,.20);
  background: #fff;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.vh-search-suggestions.is-open{
  display: block;
}

.vh-suggest{
  display: block;
  padding: 12px 14px;
  border-bottom: 1px solid var(--line);
  text-decoration: none;
}

.vh-suggest:last-child{
  border-bottom: 0;
}

.vh-suggest strong{
  display:block;
  font-size: .95rem;
}

.vh-suggest small{
  display:block;
  color: rgba(0,0,0,.65);
  margin-top: 2px;
}

.vh-suggest:hover{
  background: rgba(39,199,199,.12);
}

/* Social */
.vh-right{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.vh-icon-btn{
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,.20);
  background: rgba(255,255,255,.35);
  display:flex;
  align-items:center;
  justify-content:center;
  text-decoration:none;
}

.vh-icon-btn:hover{
  background: rgba(255,255,255,.50);
  text-decoration:none;
}

.vh-icon-play{
  width: 0; height: 0;
  border-left: 12px solid #000;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  margin-left: 2px;
}

.vh-icon-f{
  font-weight: 900;
  font-size: 18px;
}

/* Layout */
.vh-main{ padding-top: 18px; }

.vh-container{
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 16px;
}

.vh-hero{
  padding: 38px 0 12px;
}

.vh-hero h1{
  font-size: clamp(2rem, 3vw, 3rem);
  margin: 0 0 10px 0;
  letter-spacing: -.01em;
}

.vh-lead{
  max-width: 70ch;
  margin: 0 0 16px 0;
  color: rgba(0,0,0,.85);
}

.vh-cta{
  display:flex;
  gap: 12px;
  flex-wrap: wrap;
}

.vh-btn{
  display:inline-flex;
  height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,.20);
  background: #fff;
  align-items:center;
  justify-content:center;
  font-weight: 700;
  text-decoration:none;
}

.vh-btn:hover{
  background: rgba(39,199,199,.12);
  text-decoration:none;
}

.vh-btn-primary{
  background: #000;
  color: #fff;
  border-color: #000;
}

.vh-btn-primary:hover{
  background: rgba(0,0,0,.90);
}

.vh-section{
  padding: 28px 0;
}

.vh-section h2{
  margin: 0 0 8px 0;
}

.vh-sub{
  margin: 0 0 16px 0;
  color: rgba(0,0,0,.75);
}

.vh-grid{
  display:grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.vh-card{
  border: 1px solid rgba(0,0,0,.12);
  border-radius: var(--radius);
  padding: 16px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(0,0,0,.06);
}

.vh-card h3{
  margin: 0 0 8px 0;
}

.vh-card p{
  margin: 0;
  color: rgba(0,0,0,.75);
}

.vh-placeholder{
  border: 1px dashed rgba(0,0,0,.25);
  border-radius: var(--radius);
  padding: 16px;
  color: rgba(0,0,0,.65);
}

.vh-muted{ color: rgba(0,0,0,.55); }

/* Footer */
.vh-footer{
  border-top: 1px solid rgba(0,0,0,.10);
  padding: 18px 0 40px;
  margin-top: 10px;
}

/* Responsive */
@media (max-width: 980px){
  .vh-grid{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 760px){
  .vh-burger{ display:inline-block; }
  .vh-right{ display:none; }

  .vh-header-inner{
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 10px 12px;
    height: auto;
  }
  .vh-header{ height: auto; }

  .vh-nav{
    display:none;
    flex-direction: column;
    gap: 6px;
    padding: 8px 0;
  }
  .vh-nav.is-open{ display:flex; }
  .vh-search{ order: 3; }

  .vh-grid{ grid-template-columns: 1fr; }
}
