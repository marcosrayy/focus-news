import Link from "next/link";
import type { SVGProps } from "react";
import { Instagram, Linkedin, Github, MessageCircle, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";

function XSocialIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.637 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932Zm-1.29 19.493h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

const serviceLinks = [
  { label: "Desenvolvimento de Sistemas", href: "https://www.focustecnologias.com.br/#services" },
  { label: "Softwares Personalizados", href: "https://www.focustecnologias.com.br/#services" },
  { label: "Aplicativos Mobile e Desktop", href: "https://www.focustecnologias.com.br/#services" },
  { label: "Dashboards Inteligentes", href: "https://www.focustecnologias.com.br/#services" },
  { label: "Assistentes com IA", href: "https://www.focustecnologias.com.br/#services" },
];

const companyLinks = [
  { label: "Sobre nós", href: "https://www.focustecnologias.com.br/#about" },
  { label: "Como trabalhamos", href: "https://www.focustecnologias.com.br/#process" },
  { label: "Cases", href: "https://www.focustecnologias.com.br/#testimonials" },
  { label: "Carreiras", href: "https://www.focustecnologias.com.br/#careers" },
  { label: "Contato", href: "https://api.whatsapp.com/send/?phone=558586674561&text&type=phone_number&app_absent=0" },
];

const resourceLinks = [
  { label: "Blog", href: "https://focus-techblog.vercel.app/" },
  { label: "Materiais gratuitos", href: "https://www.focustecnologias.com.br/#services" },
  { label: "Documentação", href: "https://www.focustecnologias.com.br/#process" },
  { label: "FAQ", href: "https://www.focustecnologias.com.br/#testimonials" },
  { label: "Suporte", href: "https://api.whatsapp.com/send/?phone=558586674561&text&type=phone_number&app_absent=0" },
];

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/focustech.co/" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/focustech/" },
  { icon: MessageCircle, label: "E-mail", href: "mailto:contato@focustecnologia.com" },
  { icon: XSocialIcon, label: "X", href: "https://twitter.com/focustech" },
  { icon: Github, label: "GitHub", href: "https://github.com/focustech" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-foreground">
              <img src="/icon" alt="" className="h-8 w-8 shrink-0" />
              FOCUS<sup className="ml-0.5 text-[10px] font-semibold text-muted-foreground">®</sup>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Desenvolvemos soluções digitais para automatizar processos, integrar
              operações e escalar empresas com tecnologia.
            </p>
            <p className="mt-3 text-xs font-bold tracking-wide text-primary">
              Tecnologia que impulsiona negócios.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Serviços */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-sm font-bold text-foreground">Serviços</h3>
            {serviceLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors duration-300 hover:text-primary"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Empresa */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-sm font-bold text-foreground">Empresa</h3>
            {companyLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors duration-300 hover:text-primary"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Recursos */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-sm font-bold text-foreground">Recursos</h3>
            {resourceLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors duration-300 hover:text-primary"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Contato */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-sm font-bold text-foreground">Contato</h3>
            <p className="flex items-start gap-2.5 text-sm text-primary">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="text-muted-foreground">contato@focustecnologia.com</span>
            </p>
            <p className="flex items-start gap-2.5 text-sm text-primary">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="text-muted-foreground">
                Rua Barbosa de Freitas 1741, Aldeota, Fortaleza, Ceará
              </span>
            </p>
            <p className="flex items-start gap-2.5 text-sm text-primary">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="text-muted-foreground">Seg a Sex, 9h às 18h</span>
            </p>
            <a
              href="https://api.whatsapp.com/send/?phone=558586674561&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex w-fit items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-glow-sm transition-transform duration-300 hover:-translate-y-0.5"
            >
              Falar com especialista
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-muted-foreground">
            © Focus Tecnologia {new Date().getFullYear()}. Todos os direitos reservados.
          </span>
          <div className="flex items-center gap-6">
            <Link href="#privacidade" className="text-xs text-muted-foreground transition-colors duration-300 hover:text-primary">
              Política de Privacidade
            </Link>
            <Link href="#termos" className="text-xs text-muted-foreground transition-colors duration-300 hover:text-primary">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}