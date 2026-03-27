import React from 'react';
import { motion } from 'motion/react';
import { Shield, Scale, Lock, EyeOff } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export const Legal: React.FC = () => {
  const { styles } = useTheme();

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-16"
      >
        <section>
          <div className="flex items-center gap-4 mb-8">
            <Scale style={{ color: styles.text, opacity: 0.4 }} size={32} />
            <h1 className="text-5xl font-serif font-light tracking-tighter" style={{ color: styles.heading }}>
              Información <span className="italic opacity-40">Legal</span>
            </h1>
          </div>
          
          <div className="prose prose-invert max-w-none font-serif text-lg leading-relaxed space-y-12" style={{ color: styles.text }}>
            <div>
              <h2 className="text-3xl font-serif mb-6 flex items-center gap-3" style={{ color: styles.heading }}>
                <Scale size={24} style={{ color: styles.text, opacity: 0.4 }} />
                1. TÉRMINOS Y CONDICIONES DE USO
              </h2>
              <p className="italic mb-8 opacity-40">(VERSIÓN LISTA PARA PUBLICAR)</p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>1. IDENTIFICACIÓN DEL RESPONSABLE</h3>
                  <p>El presente sitio web denominado “Fantasy Mind” (en adelante, la “Plataforma”) es operado por una persona física en México (en adelante, el “Titular”).</p>
                  <p><strong>Correo de contacto legal:</strong> alahidal1hida@gmail.com</p>
                </div>

                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>2. NATURALEZA DEL SERVICIO</h3>
                  <p>Fantasy Mind es una plataforma digital de intermediación que permite a usuarios publicar, compartir y consumir contenido erótico de carácter textual y multimedia.</p>
                  <p>El Titular:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>No produce contenido</li>
                    <li>No actúa como editor</li>
                    <li>No garantiza veracidad ni legalidad del contenido</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>3. REQUISITOS DE ACCESO</h3>
                  <p>El usuario declara bajo protesta de decir verdad que:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Tiene 18 años o más</li>
                    <li>Cuenta con capacidad legal</li>
                    <li>Accede voluntariamente a contenido para adultos</li>
                  </ul>
                  <p className="font-bold text-red-500/80">El acceso por menores está estrictamente prohibido.</p>
                </div>

                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>4. REGISTRO Y CUENTA</h3>
                  <p>El usuario:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Puede utilizar seudónimo (anonimato permitido)</li>
                    <li>Es responsable de su cuenta</li>
                    <li>Garantiza que la información proporcionada es veraz</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>5. CONTENIDO PERMITIDO Y PROHIBIDO</h3>
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div className="bg-green-500/5 border border-green-500/10 p-6 rounded-2xl">
                      <h4 className="text-green-500 font-bold mb-2">✔ Permitido:</h4>
                      <p className="text-sm">Contenido erótico entre adultos con consentimiento</p>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-2xl">
                      <h4 className="text-red-500 font-bold mb-2">❌ Prohibido (tolerancia cero):</h4>
                      <ul className="text-sm space-y-1 list-none p-0">
                        <li>Cualquier contenido que involucre menores (real o ficticio)</li>
                        <li>Violación, abuso, coerción o violencia no consentida</li>
                        <li>Difusión de contenido íntimo sin consentimiento (Ley Olimpia)</li>
                        <li>Trata, explotación o pornografía ilegal</li>
                        <li>Deepfakes sexuales sin consentimiento</li>
                        <li>Publicación de datos personales de terceros</li>
                        <li>Contenido que incite a delitos</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>6. RESPONSABILIDAD DEL USUARIO</h3>
                  <p>El usuario garantiza que:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Posee los derechos del contenido publicado</li>
                    <li>Cuenta con consentimiento de las personas involucradas</li>
                    <li>El contenido es legal en su jurisdicción</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>7. PROPIEDAD INTELECTUAL</h3>
                  <p>El usuario conserva sus derechos, pero otorga a la Plataforma:</p>
                  <p>Licencia no exclusiva, mundial, gratuita para uso, reproducción y difusión</p>
                </div>

                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>8. MODERACIÓN Y RETIRO DE CONTENIDO</h3>
                  <p>Fantasy Mind podrá:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Eliminar contenido sin previo aviso</li>
                    <li>Suspender cuentas</li>
                    <li>Cooperar con autoridades</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>9. SISTEMA DE DENUNCIAS</h3>
                  <p>Se habilita el correo:</p>
                  <p className="text-xl font-mono" style={{ color: styles.heading }}>📩 alahidal1hida@gmail.com</p>
                  <p>Para:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Reporte de contenido ilegal</li>
                    <li>Solicitudes de eliminación (takedown)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>10. PAGOS Y SUSCRIPCIONES</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Los servicios pueden incluir pagos</li>
                    <li>No hay reembolsos salvo obligación legal</li>
                    <li>El usuario acepta cargos recurrentes si aplica</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>11. LIMITACIÓN DE RESPONSABILIDAD</h3>
                  <p>La Plataforma:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>No es responsable por contenido de usuarios</li>
                    <li>Actúa como intermediario tecnológico</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>12. JURISDICCIÓN</h3>
                  <p>Se rige por leyes mexicanas y tribunales competentes en México.</p>
                </div>
              </div>
            </div>

            <hr style={{ borderColor: styles.border }} />

            <div>
              <h2 className="text-3xl font-serif mb-6 flex items-center gap-3" style={{ color: styles.heading }}>
                <Lock size={24} style={{ color: styles.text, opacity: 0.4 }} />
                2. AVISO DE PRIVACIDAD (LFPDPPP + GDPR)
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>IDENTIDAD</h3>
                  <p><strong>Responsable:</strong> Titular de Fantasy Mind</p>
                  <p><strong>Correo:</strong> alahidal1hida@gmail.com</p>
                </div>

                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>DATOS RECOPILADOS</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Email</li>
                    <li>IP</li>
                    <li>Datos de navegación (cookies)</li>
                    <li>Contenido generado</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>FINALIDADES</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Gestión de cuentas</li>
                    <li>Seguridad y prevención de fraude</li>
                    <li>Procesamiento de pagos</li>
                    <li>Moderación</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>BASE LEGAL</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Consentimiento del titular</li>
                    <li>Ejecución de contrato</li>
                    <li>Interés legítimo</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>DERECHOS ARCO</h3>
                  <p>El usuario puede solicitar: Acceso, Rectificación, Cancelación, Oposición</p>
                </div>

                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>TRANSFERENCIAS INTERNACIONALES</h3>
                  <p>Se podrán transferir datos a: Servicios de hosting (Google AI Studio), Procesadores de pago</p>
                </div>

                <div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: styles.heading }}>SEGURIDAD</h3>
                  <p>Se implementan medidas técnicas y administrativas razonables.</p>
                </div>
              </div>
            </div>

            <hr style={{ borderColor: styles.border }} />

            <div>
              <h2 className="text-3xl font-serif mb-6 flex items-center gap-3" style={{ color: styles.heading }}>
                <Shield size={24} style={{ color: styles.text, opacity: 0.4 }} />
                3. POLÍTICA DE COOKIES
              </h2>
              <p>Debe incluir: Cookies técnicas (necesarias), Cookies analíticas, Cookies publicitarias</p>
              <p className="p-4 rounded-xl border" style={{ backgroundColor: styles.card, borderColor: styles.border }}>
                <strong>Requisito clave:</strong> ✔ Banner de consentimiento (UE obligatorio)
              </p>
            </div>

            <hr style={{ borderColor: styles.border }} />

            <div>
              <h2 className="text-3xl font-serif mb-6 flex items-center gap-3" style={{ color: styles.heading }}>
                <Shield size={24} style={{ color: styles.text, opacity: 0.4 }} />
                4. AVISO DE EDAD (OBLIGATORIO)
              </h2>
              <p className="text-2xl italic font-serif" style={{ color: styles.heading }}>
                “Declaro bajo protesta de decir verdad que soy mayor de 18 años y acepto acceder a contenido para adultos.”
              </p>
            </div>

            <hr style={{ borderColor: styles.border }} />

            <div>
              <h2 className="text-3xl font-serif mb-6 flex items-center gap-3" style={{ color: styles.heading }}>
                <Shield size={24} style={{ color: styles.text, opacity: 0.4 }} />
                5. DISCLAIMER (DESLINDE LEGAL)
              </h2>
              <p>Fantasy Mind:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Contiene material explícito para adultos</li>
                <li>No promueve conductas ilegales</li>
                <li>No verifica autenticidad del contenido</li>
                <li>No se responsabiliza por uso indebido</li>
              </ul>
            </div>

            <hr style={{ borderColor: styles.border }} />

            <div>
              <h2 className="text-3xl font-serif mb-6 flex items-center gap-3" style={{ color: styles.heading }}>
                <Shield size={24} style={{ color: styles.text, opacity: 0.4 }} />
                6. POLÍTICA DE CONTENIDO (BLINDAJE PENAL)
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif mb-2" style={{ color: styles.heading }}>Principios:</h3>
                  <p>Consentimiento, Legalidad, Adultos únicamente</p>
                </div>
                <div>
                  <h3 className="text-xl font-serif mb-2" style={{ color: styles.heading }}>Prohibiciones absolutas:</h3>
                  <p>Menores (incluso ficción ambigua), Violencia no consensuada, Revenge porn, Trata</p>
                </div>
                <div>
                  <h3 className="text-xl font-serif mb-2" style={{ color: styles.heading }}>Procedimiento de eliminación:</h3>
                  <p>Recepción de denuncia, Revisión, Eliminación inmediata (si aplica), Registro del incidente</p>
                </div>
              </div>
            </div>

            <hr style={{ borderColor: styles.border }} />

            <div className="p-12 rounded-[3rem] border" style={{ backgroundColor: styles.card, borderColor: styles.border }}>
              <h2 className="text-3xl font-serif mb-8 tracking-tighter italic" style={{ color: styles.heading }}>Recomendaciones Críticas</h2>
              <div className="grid md:grid-cols-2 gap-8 text-sm">
                <div className="space-y-4">
                  <h3 className="font-bold uppercase tracking-widest" style={{ color: styles.heading }}>1. Verificación Robusta</h3>
                  <p className="opacity-40">Confirmación reforzada o doble validación.</p>
                  
                  <h3 className="font-bold uppercase tracking-widest" style={{ color: styles.heading }}>2. Moderación Híbrida</h3>
                  <p className="opacity-40">IA + revisión humana.</p>
                  
                  <h3 className="font-bold uppercase tracking-widest" style={{ color: styles.heading }}>3. Registro de Logs</h3>
                  <p className="opacity-40">IP, Fecha, Usuario (Clave en defensa penal).</p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold uppercase tracking-widest" style={{ color: styles.heading }}>4. Reporte Visible</h3>
                  <p className="opacity-40">Botón visible de “Reportar contenido”.</p>
                  
                  <h3 className="font-bold uppercase tracking-widest" style={{ color: styles.heading }}>5. Filtro Automático</h3>
                  <p className="opacity-40">Filtro automático de palabras/imágenes.</p>
                </div>
              </div>
            </div>

            <div className="bg-red-500/5 p-12 rounded-[3rem] border border-red-500/10">
              <h2 className="text-3xl text-red-500 font-serif mb-8 tracking-tighter italic">🚨 Puntos de Riesgo Real</h2>
              <div className="space-y-4 text-sm">
                <p>Identificamos tres focos críticos para la seguridad jurídica:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Anonimato + contenido sexual:</strong> Requiere vigilancia constante.</li>
                  <li><strong>Multimedia:</strong> Alto riesgo penal si no se supervisa.</li>
                  <li><strong>Usuarios internacionales:</strong> Cumplimiento de GDPR y múltiples jurisdicciones.</li>
                </ul>
              </div>
            </div>

            <div className="p-12 rounded-[3rem] border" style={{ backgroundColor: styles.card, borderColor: styles.border }}>
              <h2 className="text-3xl font-serif mb-8 tracking-tighter italic" style={{ color: styles.heading }}>📌 Conclusión Operativa</h2>
              <p className="mb-6">La plataforma opera legalmente bajo el cumplimiento estricto de:</p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <ul className="list-none p-0 space-y-2">
                  <li>✔ Intermediario (no editor)</li>
                  <li>✔ Moderación activa</li>
                  <li>✔ Sistema de denuncias eficiente</li>
                </ul>
                <ul className="list-none p-0 space-y-2">
                  <li>✔ Política de contenido estricta</li>
                  <li>✔ Aviso de privacidad completo</li>
                  <li>✔ Control de edad</li>
                </ul>
              </div>
            </div>

            <div className="pt-12 text-center">
              <p className="text-xs uppercase tracking-[0.3em] opacity-20" style={{ color: styles.text }}>
                Fantasy Mind • 2026 • Todos los derechos reservados
              </p>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

