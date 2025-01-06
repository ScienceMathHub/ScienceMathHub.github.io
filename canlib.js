/*
------------------------------------------------------------------------
 Canvas library

 HTML(JavaScript, canvas)

 (c)Ohtani 2024.4 - 2025.1
------------------------------------------------------------------------
*/
'use strict'

//----------------------------------------------------------------------
// canvas
//----------------------------------------------------------------------
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

//----------------------------------------------------------------------
// 描画関数
//----------------------------------------------------------------------
String.prototype.bytes = function ()
{
  return(encodeURIComponent(this).replace(/%../g,"x").length);
}

//----------------------------------------------------------------------
// BASIC
//----------------------------------------------------------------------
class BASIC
{
  constructor()
  {
    this.WinX   =   0; //Window座標
    this.WinY   =   0;
    this.WinW   = 640;
    this.WinH   = 400;
    this.PosX   =   0; // グラフィックカレント
    this.PosY   =   0;
    this.LocX   =   0; // テキストカレント
    this.LocY   =   0;
    this.LocW   =   8; // テキストMサイズ
    this.LocH   =  16;
    this.OffW   =   0; // テキストSサイズ
    this.Offh   =   0;
    this.Zoom0  =  45; // 画面拡大基準値
    this.Zoom   =  45; // 画面拡大
    this.Width0 =   2; // 線幅基準値
    this.Width  =   2; // 線幅
    this.lineWidth(0);
    this.zooming(0);
  }
  winX(x)
  {
    return (x * this.WinW / canvas.width) + this.WinX;
  }
  winY(y)
  {
    return (y * this.WinH / canvas.height) + this.WinY;
  }
  scrX(x)
  {
    return Math.round((x - this.WinX) * canvas.width  / this.WinW);
  }
  scrY(y)
  {
    return Math.round((y - this.WinY) * canvas.height / this.WinH);
  }
  scrW(w)
  {
    return Math.round(w * canvas.width  / this.WinW);
  }
  scrH(h)
  {
    return Math.round(h * canvas.height / this.WinH);
  }
  WINDOW(x1, y1, x2, y2)
  {
    this.WinX = x1;
    this.WinY = y1;
    this.WinW = x2 - x1;
    this.WinH = y2 - y1;
  }
  LOCATEp(x, y)
  {
    if (x !== '') this.LocX = this.scrX(x);
    if (y !== '') this.LocY = this.scrY(y);
  }
  LOCATE(x, y)
  {
    if (x !== '') this.LocX = x * this.LocW;
    if (y !== '') this.LocY = y * this.LocH;
  }
  TAB(x, y)
  {
    if (x !== '') this.LocX += x * this.LocW;
    if (y !== '') this.LocY += y * this.LocH;
  }
  CR()
  {
    this.LocX = 0;
    this.LocY += this.LocH;
  }
  CRn(n)
  {
    this.LocX = 0;
    this.LocY += this.LocH * n;
  }
  CLS(c)
  {
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.LOCATE(0, 0);
  }
  FONT(zoom, offs)
  {
    let h;

    zoom = Math.round(this.Zoom * zoom / 40 * 8);
    this.LocW = zoom;
    h    = zoom * 2;
    offs = Math.round(this.Zoom * offs / 40 * 8);
    this.OffH = offs * 2;
    offs = Math.round(this.Zoom        / 40 * 8);
    this.LocH = offs * 2;
    ctx.font = h + "px 'ＭＳ ゴシック'";
//    ctx.font = h + "px 'sans-serif'";
//    ctx.font = h + "px '游ゴシック'";
//    ctx.font = h + "px '游明朝'";
    this.LocW = ctx.measureText('あ').width / 2;
  }
  COLOR(c)
  {
    ctx.fillStyle   = c;
    ctx.strokeStyle = c;
  }
  SYMBOL(x, y, text, c)
  {
    let x1, y1;

    x1 = this.scrX(x);
    y1 = this.scrY(y);
    ctx.fillStyle   = c;
    ctx.strokeStyle = c;
    ctx.fillText(text, x1, y1);
  }
  PRINT(text)
  {
    let s, n, i, w, x, m, a;

    s = String(text);
    n = s.length;
    for (i = 0; i < n; i++)
    {
      a = s.substring(i, i+1);
      w = this.LocW * 2;
      if (a.match(/[ -~]/)) w = this.LocW;
      if (a.match(/[ｧ-ﾝ]/)) w = this.LocW;
      m = ctx.measureText(a).width;
      x = (w - m) / 2;
      ctx.fillText(a, this.LocX + x, this.LocY + this.OffH - 1);
      this.LocX += w;
    }
  }
  PRINTe(s)
  {
    let i, n, num, a, p;

    s = String(s);
    p = 0;
    num = 0;
    n = s.length;
    for (i = 0; i < n; i++)
    {
      a = s.substring(i, i+1);
      if (a == 'θ')
      {
        this.PRINT(a);
        this.LocX -= this.LocW / 2;
        continue;
      }
      if (a == '^')
      {
        i++;
        a = s.substring(i, i+1);
        this.FONT(0.7, -0.3);
        this.PRINT(a); p++;
        this.FONT(1, 0);
        continue;
      }
      if (a == '_')
      {
        i++;
        a = s.substring(i, i+1);
        this.FONT(0.7, 0.1);
        this.PRINT(a); p++;
        this.FONT(1, 0);
        continue;
      }
      if (num && (a == 'e' || a == 'E'))
      {
        this.PRINT("×10");
        this.FONT(0.7, -0.4);
        i++;
        a = s.substring(i, i+1);
        if      (a == '+') { i++;                     }
        else if (a == '-') { i++; this.PRINT(a); p++; }
        for (;i < n; i++)
        {
          a = s.substring(i, i+1);
          if (!('0' <= a && a <= '9')) { i--; break; }
          this.PRINT(a); p++;
        }
        num = 0;
        this.FONT(1, 0);
        continue;
      }
      num = ('0' <= a && a <= '9')? 1 : 0;
      this.PRINT(a);
    }
    this.FONT(1, 0);
    return p;	/* 0.7の数 */
  }
  POINT(x, y)
  {
    this.PosX = this.scrX(x);
    this.PosY = this.scrY(y);
  }
  LINE(x1, y1, x2, y2, c)
  {
    ctx.strokeStyle = c;
    ctx.beginPath();
    this.PosX = this.scrX(x1);
    this.PosY = this.scrY(y1);
    ctx.moveTo(this.PosX, this.PosY);
    this.PosX = this.scrX(x2);
    this.PosY = this.scrY(y2);
    ctx.lineTo(this.PosX, this.PosY);
    ctx.stroke();
    ctx.closePath();
  }
  LINE2(x2, y2, c)
  {
    ctx.strokeStyle = c;
    ctx.beginPath();
    ctx.moveTo(this.PosX, this.PosY);
    this.PosX = this.scrX(x2);
    this.PosY = this.scrY(y2);
    ctx.lineTo(this.PosX, this.PosY);
    ctx.stroke();
    ctx.closePath();
  }
  LINEB(x1, y1, x2, y2, c)
  {
    this.LINE(x1, y1, x1, y2, c);
    this.LINE(x2, y1, x2, y2, c);
    this.LINE(x1, y1, x2, y1, c);
    this.LINE(x1, y2, x2, y2, c);
  }
/*
  LINEB(x1, y1, x2, y2, c)
  {
    let x, y, w, h;

    x = this.scrX(x1);
    y = this.scrY(y1);
    this.PosX = this.scrX(x2);
    this.PosY = this.scrY(y2);
    w = this.PosX - x + 1;
    h = this.PosY - y + 1;
    ctx.strokeStyle = c;
    ctx.strokeRect(x, y, w, h);
  }
*/
  LINEBF(x1, y1, x2, y2, c)
  {
    let x, y, w, h;

    x = this.scrX(x1);
    y = this.scrY(y1);
    this.PosX = this.scrX(x2);
    this.PosY = this.scrY(y2);
    w = this.PosX - x + 1;
    h = this.PosY - y + 1;
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
  }
  CIRCLERF(x, y, r0, c)
  {
    let x0, y0;

    this.PosX = x0 = this.scrX(x);
    this.PosY = y0 = this.scrY(y);

    ctx.beginPath();
    ctx.arc(x0, y0, r0, 0, Math.PI * 2, true);
    ctx.fillStyle = c; // ctx.strokeStyle = c;
    ctx.fill();        // ctx.stroke();
  }
  // window func
  zooming(sign)
  {
    if (sign == 0) { this.Zoom = this.Zoom0; }
    else
    {
      this.Zoom += sign * 5;
      if      (this.Zoom <  20) this.Zoom =  20;
      else if (this.Zoom > 120) this.Zoom = 120;
    }
    canvas.width  = 16 * this.Zoom;
    canvas.height =  9 * this.Zoom;
    ctx.lineWidth = this.Width;
    this.FONT(1, 0);
  }
  lineWidth(times)
  {
    if (times == 1) { this.Width = this.Width0; }
    else
    {
      this.Width *= times;
      if      (this.Width < 1) this.Width = 1;
      else if (this.Width > 8) this.Width = 8;
    }
    ctx.lineWidth = this.Width;
  }
  // math func (precision)
  precision(a)
  {
    let s, i;

    s = a.toPrecision(12);
    s = s.replace(/[+-]/g, "");
    if (!(/^\d*\./.test(s)))
    { // 10の0を消す、1.0の0は消さない
      s = s.replace(/0+$/g, "");
    }
    s = s.replace(/\./g, "");
    s = s.replace(/^0+/g, "");
    s = s.replace(/[eE]\d+/g, "");

    return s.length;
  }
  precision0(a)
  {
    let s, i;

    s = a.toPrecision(12);
    s = s.replace(/[+-]/g, "");
    s = s.replace(/[eE]\d+/g, "");
    if (/^\d*\./.test(s))
    { // 1.0の0を消す、10の0は消さない
      s = s.replace(/0+$/g, "");
    }
    s = s.replace(/\./g, "");
    s = s.replace(/^0+/g, "");

    return s.length;
  }
}
