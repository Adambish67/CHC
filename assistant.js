/* ============================================================
   CHC Health Assistant — trilingual educational chat widget.
   Runs fully in the browser with a curated knowledge base, so it
   works on static hosting with no API keys. General education
   only — every answer is framed as non-medical advice.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- UI strings ---------- */
  var UI = {
    en: {
      fab: "Health Q&A",
      title: "CHC Health Assistant",
      disclaimer: "This assistant shares general health education only. It is not medical advice, does not know your personal health situation, and never replaces your doctor.",
      placeholder: "Ask about food, exercise, sleep…",
      send: "Send",
      greeting: "Hi! I'm the CHC Health Assistant. I can answer common questions about healthy eating, exercise, sleep, and stress — in English, Español, or العربية.\n\nRemember: I share general education only, not medical advice. For personal health questions, always talk to your doctor.\n\nWhat would you like to know?",
      fallback: "I'm sorry — I don't have an answer for that yet. I can help with topics like fiber, portion sizes, salt, sugary drinks, exercise, sleep, stress, and fasting.\n\nFor anything personal or medical, please talk to your doctor, or send us a message on our <a href='Contact.html'>Contact page</a>.",
      emergency: "⚠️ If you are experiencing chest pain, trouble breathing, signs of a stroke, very high or very low blood sugar with confusion, or any medical emergency, call 911 (or your local emergency number) right away. Please do not rely on this chat for emergencies.",
      chips: ["How do I eat more fiber?", "Tips for portion sizes", "How to lower blood pressure?", "Easy exercise ideas", "Better sleep tips", "Fasting with diabetes?"]
    },
    es: {
      fab: "Preguntas de Salud",
      title: "Asistente de Salud CHC",
      disclaimer: "Este asistente ofrece solo educación general de salud. No es consejo médico, no conoce su situación personal y nunca reemplaza a su médico.",
      placeholder: "Pregunte sobre comida, ejercicio, sueño…",
      send: "Enviar",
      greeting: "¡Hola! Soy el Asistente de Salud de CHC. Puedo responder preguntas comunes sobre alimentación saludable, ejercicio, sueño y estrés — en English, Español o العربية.\n\nRecuerde: comparto solo educación general, no consejo médico. Para preguntas personales de salud, hable siempre con su médico.\n\n¿Qué le gustaría saber?",
      fallback: "Lo siento — todavía no tengo una respuesta para eso. Puedo ayudar con temas como fibra, porciones, sal, bebidas azucaradas, ejercicio, sueño, estrés y ayuno.\n\nPara cualquier tema personal o médico, hable con su médico o envíenos un mensaje en nuestra <a href='Contact.html'>página de contacto</a>.",
      emergency: "⚠️ Si tiene dolor en el pecho, dificultad para respirar, señales de un derrame cerebral, azúcar muy alta o muy baja con confusión, o cualquier emergencia médica, llame al 911 de inmediato. No use este chat para emergencias.",
      chips: ["¿Cómo comer más fibra?", "Consejos de porciones", "¿Cómo bajar la presión?", "Ideas fáciles de ejercicio", "Consejos para dormir mejor", "¿Ayunar con diabetes?"]
    },
    ar: {
      fab: "أسئلة صحية",
      title: "مساعد CHC الصحي",
      disclaimer: "يقدّم هذا المساعد تثقيفاً صحياً عاماً فقط. وهو ليس نصيحة طبية، ولا يعرف حالتك الصحية الشخصية، ولا يغني أبداً عن استشارة طبيبك.",
      placeholder: "اسأل عن الغذاء أو الرياضة أو النوم…",
      send: "إرسال",
      greeting: "مرحباً! أنا مساعد CHC الصحي. يمكنني الإجابة عن الأسئلة الشائعة حول الأكل الصحي والرياضة والنوم والتوتر — بالإنجليزية أو الإسبانية أو العربية.\n\nتذكّر: أقدّم تثقيفاً عاماً فقط وليس نصيحة طبية. للأسئلة الصحية الشخصية، استشر طبيبك دائماً.\n\nماذا تودّ أن تعرف؟",
      fallback: "عذراً — لا أملك إجابة على ذلك بعد. يمكنني المساعدة في مواضيع مثل الألياف وحجم الحصص والملح والمشروبات السكرية والرياضة والنوم والتوتر والصيام.\n\nلأي موضوع شخصي أو طبي، يرجى استشارة طبيبك أو مراسلتنا عبر <a href='Contact.html'>صفحة الاتصال</a>.",
      emergency: "⚠️ إذا كنت تعاني من ألم في الصدر، أو صعوبة في التنفس، أو علامات سكتة دماغية، أو ارتفاع/انخفاض شديد في السكر مع تشوّش، أو أي حالة طارئة، اتصل بالرقم 911 فوراً. لا تعتمد على هذه المحادثة في الحالات الطارئة.",
      chips: ["كيف أتناول المزيد من الألياف؟", "نصائح لحجم الحصص", "كيف أخفض ضغط الدم؟", "أفكار رياضية سهلة", "نصائح لنوم أفضل", "الصيام مع السكري؟"]
    }
  };

  /* ---------- Emergency keywords (checked first) ---------- */
  var EMERGENCY = [
    "chest pain", "can't breathe", "cant breathe", "trouble breathing", "heart attack",
    "stroke", "unconscious", "fainted", "911", "emergency", "suicid", "overdose",
    "dolor de pecho", "no puedo respirar", "infarto", "derrame", "emergencia", "desmay",
    "ألم في الصدر", "لا أستطيع التنفس", "نوبة قلبية", "سكتة", "طوارئ", "إغماء", "اغماء"
  ];

  /* ---------- Knowledge base ----------
     Each topic: kw = keywords in all 3 languages, a = answers per language.
     Answers reuse the evidence already cited across the CHC site.       */
  var KB = [
    {
      kw: ["fiber", "fibre", "beans", "lentil", "whole grain", "fibra", "frijol", "lenteja", "grano entero", "ألياف", "الألياف", "فول", "عدس", "بقوليات"],
      a: {
        en: "Fiber is one of the best tools for blood sugar and cholesterol. Adults should aim for about 22–34 grams per day (CDC guidance).\n\nEasy ways to get there:\n• Add a cup of beans or lentils to meals 3–4 times a week (~8 g per cup) — research shows this can lower HbA1c by about 0.5%.\n• Choose whole grains like bulgur, brown rice, or corn tortillas.\n• Fill half your plate with vegetables.\n\nFiber supplements mixed with water are also a reasonable option.",
        es: "La fibra es una de las mejores herramientas para el azúcar en sangre y el colesterol. Los adultos deben consumir de 22 a 34 gramos al día (guía de los CDC).\n\nFormas fáciles de lograrlo:\n• Agregue una taza de frijoles o lentejas a sus comidas 3–4 veces por semana (~8 g por taza) — estudios muestran que esto puede bajar la HbA1c en un 0.5%.\n• Elija granos enteros como bulgur, arroz integral o tortillas de maíz.\n• Llene la mitad de su plato con verduras.\n\nLos suplementos de fibra en agua también son una buena opción.",
        ar: "الألياف من أفضل الوسائل لضبط سكر الدم والكوليسترول. يُنصح البالغون بتناول 22–34 غراماً يومياً (إرشادات مركز السيطرة على الأمراض).\n\nطرق سهلة لتحقيق ذلك:\n• أضف كوباً من الفول أو العدس إلى وجباتك 3–4 مرات أسبوعياً (نحو 8 غرامات للكوب) — أظهرت الأبحاث أن ذلك قد يخفض HbA1c بنحو 0.5%.\n• اختر الحبوب الكاملة مثل البرغل والأرز البني.\n• املأ نصف طبقك بالخضروات.\n\nمكملات الألياف المذابة في الماء خيار جيد أيضاً."
      }
    },
    {
      kw: ["portion", "plate", "how much should i eat", "serving size", "porcion", "porción", "plato", "cuánto comer", "cuanto comer", "حصص", "حصة", "كمية الطعام", "طبق"],
      a: {
        en: "Portion control is powerful — one study found people with diabetes who used a portion-control plate lost weight and some needed less medication.\n\nSimple tricks:\n• Use a smaller plate.\n• Fill half the plate with vegetables, a quarter with protein, a quarter with carbs like rice or bread.\n• Serve food in the kitchen instead of family-style at the table.\n• Eat slowly — it takes ~20 minutes to feel full.\n\nNo food is forbidden; it's about balance, not elimination.",
        es: "El control de porciones es poderoso — un estudio encontró que personas con diabetes que usaron un plato de control de porciones perdieron peso y algunas necesitaron menos medicamento.\n\nTrucos simples:\n• Use un plato más pequeño.\n• Llene la mitad con verduras, un cuarto con proteína y un cuarto con carbohidratos como arroz o pan.\n• Sirva la comida en la cocina en lugar de poner las ollas en la mesa.\n• Coma despacio — el cuerpo tarda ~20 minutos en sentirse lleno.\n\nNingún alimento está prohibido; se trata de equilibrio, no de eliminación.",
        ar: "التحكم في الحصص فعّال جداً — وجدت دراسة أن مرضى السكري الذين استخدموا طبقاً للتحكم في الحصص خسروا وزناً واحتاج بعضهم إلى دواء أقل.\n\nحيل بسيطة:\n• استخدم طبقاً أصغر.\n• املأ نصف الطبق بالخضروات، وربعه بالبروتين، وربعه بالنشويات كالأرز أو الخبز.\n• اغرف الطعام في المطبخ بدلاً من وضع القدور على المائدة.\n• كل ببطء — يحتاج الجسم نحو 20 دقيقة ليشعر بالشبع.\n\nلا يوجد طعام ممنوع؛ المهم هو التوازن لا الحرمان."
      }
    },
    {
      kw: ["blood pressure", "hypertension", "salt", "sodium", "presion", "presión", "hipertension", "hipertensión", "sal", "sodio", "ضغط الدم", "الضغط", "ملح", "الملح", "صوديوم"],
      a: {
        en: "Lowering salt helps quickly: a clinical trial found a low-sodium diet reduced systolic blood pressure by 7–8 mm Hg in about a week (American Heart Association, 2023).\n\nTry:\n• Season with lemon, garlic, sumac, cumin, cilantro, and herbs instead of extra salt.\n• Rinse canned beans and vegetables.\n• Watch salty items like pickles, olives, processed meats, and bouillon cubes.\n• Walking most days and managing stress also lower blood pressure.\n\nIf you take blood pressure medication, never change it without your doctor.",
        es: "Reducir la sal ayuda rápido: un ensayo clínico encontró que una dieta baja en sodio redujo la presión sistólica de 7 a 8 mm Hg en una semana (Asociación Americana del Corazón, 2023).\n\nIntente:\n• Sazonar con limón, ajo, comino, cilantro y hierbas en lugar de más sal.\n• Enjuagar los frijoles y verduras enlatados.\n• Cuidado con encurtidos, aceitunas, carnes procesadas y cubos de caldo.\n• Caminar casi todos los días y manejar el estrés también baja la presión.\n\nSi toma medicamento para la presión, nunca lo cambie sin su médico.",
        ar: "تقليل الملح يساعد بسرعة: وجدت تجربة سريرية أن النظام الغذائي قليل الصوديوم خفّض الضغط الانقباضي بمقدار 7–8 ملم زئبق خلال أسبوع تقريباً (جمعية القلب الأمريكية، 2023).\n\nجرّب:\n• التتبيل بالليمون والثوم والسماق والكمون والأعشاب بدلاً من الملح الزائد.\n• شطف البقوليات والخضروات المعلبة.\n• الانتباه للمخللات والزيتون واللحوم المصنّعة ومكعبات المرق.\n• المشي معظم الأيام وإدارة التوتر يخفضان الضغط أيضاً.\n\nإذا كنت تتناول دواءً للضغط، فلا تغيّره أبداً دون استشارة طبيبك."
      }
    },
    {
      kw: ["sugar", "sweets", "soda", "dessert", "sugary drink", "juice", "azucar", "azúcar", "dulces", "refresco", "postre", "jugo", "سكر", "السكر", "حلويات", "مشروبات غازية", "عصير"],
      a: {
        en: "You don't have to give up sweets forever — moderation beats elimination.\n\nWhat helps most:\n• Sugary drinks (soda, sweet tea, juice) are the biggest source of added sugar. Swapping them for water, sparkling water, or unsweetened tea/coffee is one of the single best changes you can make.\n• Enjoy dessert in small portions, ideally after a meal with fiber and protein rather than on an empty stomach.\n• A 10-minute walk after eating helps blunt the blood sugar spike.",
        es: "No tiene que renunciar a los dulces para siempre — la moderación es mejor que la eliminación.\n\nLo que más ayuda:\n• Las bebidas azucaradas (refresco, té dulce, jugo) son la mayor fuente de azúcar añadida. Cambiarlas por agua, agua mineral o té/café sin azúcar es uno de los mejores cambios posibles.\n• Disfrute el postre en porciones pequeñas, idealmente después de una comida con fibra y proteína.\n• Una caminata de 10 minutos después de comer ayuda a reducir el pico de azúcar.",
        ar: "لست مضطراً للتخلي عن الحلويات إلى الأبد — الاعتدال أفضل من الحرمان.\n\nأكثر ما يساعد:\n• المشروبات السكرية (الغازية، الشاي المحلّى، العصير) هي أكبر مصدر للسكر المضاف. استبدالها بالماء أو الماء الفوّار أو الشاي والقهوة غير المحلاة من أفضل التغييرات الممكنة.\n• استمتع بالحلويات بحصص صغيرة، ويفضَّل بعد وجبة تحتوي على ألياف وبروتين.\n• المشي 10 دقائق بعد الأكل يساعد على تقليل ارتفاع السكر."
      }
    },
    {
      kw: ["exercise", "walk", "walking", "activity", "workout", "gym", "ejercicio", "caminar", "caminata", "actividad", "gimnasio", "رياضة", "تمارين", "تمرين", "مشي", "المشي", "نشاط"],
      a: {
        en: "You don't need a gym! Small, regular movement makes a real difference:\n\n• 10-minute walks after meals meaningfully lower post-meal blood sugar.\n• Taking stairs, walking uphill, squats, and wall push-ups build muscle — and muscle acts like a sponge for blood sugar.\n• Carrying groceries, standing often, and walking while talking all add up.\n\nStart small: even a few minutes after each meal is a great first step. If you have heart problems or haven't exercised in a long time, check with your doctor first.",
        es: "¡No necesita un gimnasio! El movimiento pequeño y regular hace una diferencia real:\n\n• Caminar 10 minutos después de las comidas reduce significativamente el azúcar postcomida.\n• Subir escaleras, caminar en subida, sentadillas y flexiones contra la pared construyen músculo — y el músculo actúa como una esponja para el azúcar.\n• Cargar las compras, pararse seguido y caminar mientras habla, todo suma.\n\nEmpiece poco a poco. Si tiene problemas del corazón o lleva mucho tiempo sin ejercitarse, consulte primero a su médico.",
        ar: "لا تحتاج إلى صالة رياضية! الحركة البسيطة المنتظمة تُحدث فرقاً حقيقياً:\n\n• المشي 10 دقائق بعد الوجبات يخفض سكر الدم بعد الأكل بشكل ملحوظ.\n• صعود الدرج والمشي في المرتفعات وتمارين القرفصاء والضغط على الحائط تبني العضلات — والعضلات تعمل كإسفنجة لامتصاص السكر.\n• حمل المشتريات والوقوف المتكرر والمشي أثناء الحديث، كلها تتراكم.\n\nابدأ بخطوات صغيرة. وإذا كنت تعاني من مشاكل قلبية أو لم تمارس الرياضة منذ فترة طويلة، فاستشر طبيبك أولاً."
      }
    },
    {
      kw: ["resistance", "muscle", "strength", "weights", "musculo", "músculo", "fuerza", "pesas", "عضلات", "العضلات", "مقاومة", "أوزان", "قوة"],
      a: {
        en: "Resistance training is one of the best long-term investments in your health. People who do it regularly have a 10–17% lower risk of heart disease, diabetes, cancer, and early death (Circulation, 2023).\n\nJust 30–60 minutes per week provides most of the benefit. No equipment needed:\n• Squats, wall push-ups, chair sit-to-stands\n• Inexpensive resistance bands\n• Carrying groceries or climbing stairs\n\nMore muscle means your body handles blood sugar better.",
        es: "El entrenamiento de resistencia es una de las mejores inversiones para su salud. Quienes lo practican tienen un riesgo 10–17% menor de enfermedades cardíacas, diabetes, cáncer y muerte prematura (Circulation, 2023).\n\nSolo 30–60 minutos por semana brindan la mayor parte del beneficio. Sin equipo:\n• Sentadillas, flexiones contra la pared, levantarse de una silla\n• Bandas de resistencia económicas\n• Cargar las compras o subir escaleras\n\nMás músculo significa que su cuerpo maneja mejor el azúcar.",
        ar: "تدريب المقاومة من أفضل الاستثمارات طويلة الأمد لصحتك. من يمارسونه بانتظام لديهم خطر أقل بنسبة 10–17% للإصابة بأمراض القلب والسكري والسرطان والوفاة المبكرة (Circulation، 2023).\n\n30–60 دقيقة أسبوعياً فقط توفر معظم الفائدة. دون معدات:\n• القرفصاء، والضغط على الحائط، والنهوض من الكرسي\n• أربطة المقاومة غير المكلفة\n• حمل المشتريات أو صعود الدرج\n\nكلما زادت عضلاتك، تعامل جسمك مع السكر بشكل أفضل."
      }
    },
    {
      kw: ["sleep", "insomnia", "tired", "dormir", "sueño", "sueno", "insomnio", "cansado", "نوم", "النوم", "أرق", "الأرق", "تعب"],
      a: {
        en: "Sleep is when the body repairs itself and balances blood sugar. Poor sleep makes the body less responsive to insulin and increases appetite the next day.\n\nWhat helps:\n• A steady bedtime and wake time, even on weekends\n• A cool, dark, quiet room\n• Less screen time in the hour before bed\n• Avoiding caffeine (coffee, tea, cola) after mid-afternoon\n\nIf you snore heavily or wake up exhausted every day, mention it to your doctor — sleep apnea is common and treatable.",
        es: "El sueño es cuando el cuerpo se repara y equilibra el azúcar. Dormir mal hace al cuerpo menos sensible a la insulina y aumenta el apetito al día siguiente.\n\nLo que ayuda:\n• Horario fijo para acostarse y despertar, incluso los fines de semana\n• Un cuarto fresco, oscuro y silencioso\n• Menos pantallas en la hora antes de dormir\n• Evitar cafeína (café, té, refresco de cola) después de media tarde\n\nSi ronca mucho o despierta agotado cada día, coménteselo a su médico — la apnea del sueño es común y tratable.",
        ar: "النوم هو وقت إصلاح الجسم لنفسه وموازنة سكر الدم. قلة النوم تجعل الجسم أقل استجابة للأنسولين وتزيد الشهية في اليوم التالي.\n\nما يساعد:\n• موعد ثابت للنوم والاستيقاظ حتى في العطلات\n• غرفة باردة ومظلمة وهادئة\n• تقليل الشاشات في الساعة الأخيرة قبل النوم\n• تجنّب الكافيين (القهوة والشاي والكولا) بعد منتصف النهار\n\nإذا كنت تشخر بشدة أو تستيقظ منهكاً يومياً، أخبر طبيبك — انقطاع النفس النومي شائع وقابل للعلاج."
      }
    },
    {
      kw: ["stress", "anxiety", "worried", "breathing", "prayer", "relax", "estres", "estrés", "ansiedad", "respiracion", "respiración", "oracion", "oración", "relajarse", "توتر", "التوتر", "قلق", "القلق", "تنفس", "صلاة", "استرخاء"],
      a: {
        en: "Stress hormones like cortisol can raise blood sugar and blood pressure. Moments of calm genuinely help.\n\nEvidence-backed options:\n• 5–10 minutes of slow, quiet breathing daily — during morning prayer, before a meal, or in the evening\n• Time with family, friends, or your faith community (strong social ties are linked to better blood sugar control)\n• A short walk outside\n\nIf stress or sadness feels overwhelming or lasts for weeks, please talk to your doctor — mental health is health.",
        es: "Las hormonas del estrés como el cortisol pueden subir el azúcar y la presión. Los momentos de calma realmente ayudan.\n\nOpciones respaldadas por la evidencia:\n• 5–10 minutos diarios de respiración lenta — durante la oración, antes de una comida o por la noche\n• Tiempo con familia, amigos o su comunidad de fe (los lazos sociales fuertes se asocian con mejor control del azúcar)\n• Una caminata corta al aire libre\n\nSi el estrés o la tristeza se sienten abrumadores o duran semanas, hable con su médico — la salud mental también es salud.",
        ar: "هرمونات التوتر مثل الكورتيزول قد ترفع سكر الدم وضغط الدم. لحظات الهدوء تساعد حقاً.\n\nخيارات مدعومة بالأدلة:\n• 5–10 دقائق يومياً من التنفس البطيء الهادئ — أثناء الصلاة أو قبل الوجبة أو في المساء\n• الوقت مع العائلة والأصدقاء أو مجتمعك الديني (الروابط الاجتماعية القوية مرتبطة بتحكم أفضل في السكر)\n• مشية قصيرة في الهواء الطلق\n\nإذا كان التوتر أو الحزن غامراً أو استمر لأسابيع، فتحدث إلى طبيبك — الصحة النفسية جزء من الصحة."
      }
    },
    {
      kw: ["diabetes", "prediabetes", "blood sugar", "glucose", "insulin", "azucar en sangre", "azúcar en sangre", "glucosa", "insulina", "سكري", "السكري", "سكر الدم", "جلوكوز", "أنسولين", "انسولين"],
      a: {
        en: "Type 2 diabetes develops when the body stops using insulin well, causing blood sugar to stay high. The encouraging news: food, movement, sleep, and stress management all measurably improve it.\n\nThe big four:\n1. More fiber (beans, lentils, vegetables, whole grains)\n2. Balanced portions — especially of rice, bread, and sweets\n3. Regular movement, like 10-minute walks after meals\n4. Good sleep and lower stress\n\nOnly a doctor can diagnose or treat diabetes, and medication decisions always belong with your care team. If you haven't been screened and diabetes runs in your family, ask your doctor about a simple blood test.",
        es: "La diabetes tipo 2 se desarrolla cuando el cuerpo deja de usar bien la insulina y el azúcar permanece alta. La buena noticia: la comida, el movimiento, el sueño y el manejo del estrés la mejoran de forma medible.\n\nLos cuatro grandes:\n1. Más fibra (frijoles, lentejas, verduras, granos enteros)\n2. Porciones equilibradas — especialmente de arroz, pan y dulces\n3. Movimiento regular, como caminatas de 10 minutos después de comer\n4. Buen sueño y menos estrés\n\nSolo un médico puede diagnosticar o tratar la diabetes. Si no se ha hecho pruebas y hay diabetes en su familia, pregunte a su médico por un análisis de sangre sencillo.",
        ar: "يتطور السكري من النوع الثاني عندما يتوقف الجسم عن استخدام الأنسولين جيداً فيبقى سكر الدم مرتفعاً. الخبر المشجّع: الغذاء والحركة والنوم وإدارة التوتر كلها تحسّنه بشكل ملموس.\n\nالأربعة الكبار:\n1. المزيد من الألياف (الفول والعدس والخضروات والحبوب الكاملة)\n2. حصص متوازنة — خاصة من الأرز والخبز والحلويات\n3. حركة منتظمة مثل المشي 10 دقائق بعد الوجبات\n4. نوم جيد وتوتر أقل\n\nالطبيب وحده من يشخّص السكري ويعالجه. إذا لم تُفحص من قبل ولديك تاريخ عائلي للسكري، اسأل طبيبك عن فحص دم بسيط."
      }
    },
    {
      kw: ["hba1c", "a1c", "hemoglobin", "hemoglobina", "تحليل السكر التراكمي", "التراكمي"],
      a: {
        en: "HbA1c (A1c) is a blood test that reflects your average blood sugar over the past ~3 months. Doctors use it to diagnose and monitor diabetes.\n\nLifestyle really moves it: for example, regularly eating a cup of beans or lentils most days has been shown to lower HbA1c by about 0.5% (Jenkins et al., 2012). Ask your doctor what your A1c is, what your personal target should be, and how often to check it.",
        es: "La HbA1c (A1c) es un análisis de sangre que refleja su azúcar promedio de los últimos ~3 meses. Los médicos la usan para diagnosticar y monitorear la diabetes.\n\nEl estilo de vida realmente la cambia: por ejemplo, comer regularmente una taza de frijoles o lentejas puede bajar la HbA1c en aproximadamente 0.5% (Jenkins et al., 2012). Pregunte a su médico cuál es su A1c, cuál debe ser su meta personal y con qué frecuencia revisarla.",
        ar: "فحص HbA1c (السكر التراكمي) هو تحليل دم يعكس متوسط سكر الدم خلال آخر ثلاثة أشهر تقريباً. يستخدمه الأطباء لتشخيص السكري ومتابعته.\n\nنمط الحياة يؤثر فيه فعلاً: مثلاً، تناول كوب من الفول أو العدس بانتظام ثبت أنه يخفض التراكمي بنحو 0.5% (Jenkins وآخرون، 2012). اسأل طبيبك عن نتيجتك وهدفك الشخصي وعدد مرات الفحص."
      }
    },
    {
      kw: ["ramadan", "fasting", "fast", "ayuno", "ayunar", "رمضان", "صيام", "الصيام", "صوم"],
      a: {
        en: "Fasting — including Ramadan — is deeply meaningful, and many people with diabetes fast safely. But it requires planning, because some medications can cause low blood sugar while fasting.\n\nPlease talk with your doctor *before* fasting; medication doses and timing often need adjusting. General tips many care teams suggest:\n• Don't skip suhoor, and include fiber and protein\n• Break the fast with water; go easy on sweets and fried foods at iftar\n• Know the signs of low blood sugar (shakiness, sweating, confusion) — if they occur, it is medically necessary to break the fast\n\nYour doctor can help you make a plan that honors both your faith and your health.",
        es: "El ayuno tiene un profundo significado y muchas personas con diabetes ayunan de forma segura. Pero requiere planificación, porque algunos medicamentos pueden causar azúcar baja durante el ayuno.\n\nHable con su médico *antes* de ayunar; a menudo hay que ajustar dosis y horarios. Consejos generales:\n• No se salte la comida previa al ayuno; incluya fibra y proteína\n• Rompa el ayuno con agua; modere los dulces y frituras\n• Conozca las señales de azúcar baja (temblor, sudoración, confusión) — si aparecen, es médicamente necesario romper el ayuno\n\nSu médico puede ayudarle a hacer un plan que honre su fe y su salud.",
        ar: "للصيام — ومنه صيام رمضان — معنى عظيم، وكثير من مرضى السكري يصومون بأمان. لكنه يتطلب تخطيطاً، لأن بعض الأدوية قد تسبب هبوط السكر أثناء الصيام.\n\nيرجى استشارة طبيبك *قبل* الصيام؛ فجرعات الأدوية ومواعيدها كثيراً ما تحتاج إلى تعديل. نصائح عامة يوصي بها كثير من الأطباء:\n• لا تفوّت السحور، واحرص على الألياف والبروتين فيه\n• افطر على الماء، وخفف من الحلويات والمقليات في الإفطار\n• اعرف علامات هبوط السكر (رجفة، تعرّق، تشوّش) — وإذا ظهرت فالإفطار ضرورة طبية، والشرع يجيزه\n\nطبيبك يستطيع مساعدتك في وضع خطة توازن بين دينك وصحتك."
      }
    },
    {
      kw: ["weight", "lose weight", "obesity", "diet plan", "peso", "bajar de peso", "adelgazar", "obesidad", "وزن", "الوزن", "إنقاص الوزن", "انقاص الوزن", "سمنة", "رجيم", "ريجيم"],
      a: {
        en: "Sustainable weight loss comes from small changes you can keep — not crash diets.\n\nWhat the evidence supports:\n• Smaller portions on a smaller plate (proven to help people with diabetes lose weight)\n• Swapping sugary drinks for water\n• More fiber and protein, which keep you full longer\n• Building muscle with simple resistance exercises\n• Consistent sleep — poor sleep increases appetite\n\nAim for slow, steady progress. Your doctor or a registered dietitian can help set a safe, personal plan.",
        es: "La pérdida de peso sostenible viene de cambios pequeños que puede mantener — no de dietas extremas.\n\nLo que la evidencia apoya:\n• Porciones más pequeñas en un plato más pequeño\n• Cambiar bebidas azucaradas por agua\n• Más fibra y proteína, que dan saciedad por más tiempo\n• Construir músculo con ejercicios de resistencia simples\n• Dormir bien — dormir mal aumenta el apetito\n\nBusque un progreso lento y constante. Su médico o un nutriólogo puede ayudarle con un plan personal y seguro.",
        ar: "إنقاص الوزن المستدام يأتي من تغييرات صغيرة يمكنك الاستمرار عليها — لا من الحميات القاسية.\n\nما تدعمه الأدلة:\n• حصص أصغر في طبق أصغر\n• استبدال المشروبات السكرية بالماء\n• المزيد من الألياف والبروتين لشعور أطول بالشبع\n• بناء العضلات بتمارين مقاومة بسيطة\n• نوم منتظم — قلة النوم تزيد الشهية\n\nاهدف إلى تقدّم بطيء وثابت. يمكن لطبيبك أو أخصائي التغذية وضع خطة آمنة تناسبك."
      }
    },
    {
      kw: ["rice", "bread", "tortilla", "biryani", "kabsa", "tamales", "pan dulce", "carbs", "carbohydrate", "arroz", "pan", "carbohidratos", "أرز", "الأرز", "خبز", "الخبز", "برياني", "كبسة", "نشويات", "كربوهيدرات"],
      a: {
        en: "You don't have to give up rice, bread, tortillas, biryani, or tamales! Our whole philosophy is moderation over elimination.\n\nWays to enjoy them with better blood sugar:\n• Keep carb portions to about a quarter of your plate, and fill half with vegetables\n• Pair carbs with protein and fiber (beans, salad, yogurt) to slow the sugar rise\n• Try mixing in whole grains — bulgur with rice, corn tortillas, whole-wheat bread\n• Take a 10-minute walk after the meal\n\nFood is family, tradition, and joy — health advice should honor that.",
        es: "¡No tiene que renunciar al arroz, el pan, las tortillas o los tamales! Nuestra filosofía es moderación en lugar de eliminación.\n\nFormas de disfrutarlos con mejor azúcar:\n• Mantenga los carbohidratos en un cuarto del plato y llene la mitad con verduras\n• Combine los carbohidratos con proteína y fibra (frijoles, ensalada, yogur) para que el azúcar suba más despacio\n• Pruebe granos enteros — tortillas de maíz, pan integral\n• Camine 10 minutos después de la comida\n\nLa comida es familia, tradición y alegría — los consejos de salud deben respetar eso.",
        ar: "لست مضطراً للتخلي عن الأرز أو الخبز أو البرياني أو الكبسة! فلسفتنا كلها هي الاعتدال بدلاً من الحرمان.\n\nطرق للاستمتاع بها مع سكر أفضل:\n• اجعل النشويات نحو ربع الطبق، واملأ النصف بالخضروات\n• اجمع النشويات مع البروتين والألياف (بقوليات، سلطة، لبن) لإبطاء ارتفاع السكر\n• جرّب الحبوب الكاملة — البرغل مع الأرز، والخبز الأسمر\n• امشِ 10 دقائق بعد الوجبة\n\nالطعام عائلة وتراث وفرح — ونصائح الصحة يجب أن تحترم ذلك."
      }
    },
    {
      kw: ["water", "hydration", "drink", "agua", "hidratacion", "hidratación", "beber", "ماء", "الماء", "شرب", "ترطيب"],
      a: {
        en: "Water is the best everyday drink — zero sugar, zero calories. Replacing soda, sweet tea, or juice with water is one of the most effective single changes for blood sugar and weight.\n\nTips:\n• Keep a bottle with you and sip through the day\n• Flavor water with lemon, mint, or cucumber\n• Unsweetened tea and coffee count too\n\nNeeds vary by person, so let thirst guide you — and ask your doctor if you have kidney or heart conditions that affect fluids.",
        es: "El agua es la mejor bebida diaria — cero azúcar, cero calorías. Reemplazar el refresco, el té dulce o el jugo con agua es uno de los cambios más efectivos para el azúcar y el peso.\n\nConsejos:\n• Lleve una botella y tome sorbos durante el día\n• Dele sabor con limón, menta o pepino\n• El té y el café sin azúcar también cuentan\n\nLas necesidades varían según la persona; si tiene condiciones del riñón o del corazón, consulte a su médico sobre los líquidos.",
        ar: "الماء هو أفضل مشروب يومي — بلا سكر وبلا سعرات. استبدال المشروبات الغازية والشاي المحلّى والعصير بالماء من أكثر التغييرات فعالية للسكر والوزن.\n\nنصائح:\n• احمل قارورة ماء واشرب على مدار اليوم\n• أضف نكهة بالليمون أو النعناع أو الخيار\n• الشاي والقهوة غير المحلاة يُحسبان أيضاً\n\nتختلف الاحتياجات من شخص لآخر؛ وإذا كانت لديك حالة في الكلى أو القلب تؤثر على السوائل فاستشر طبيبك."
      }
    },
    {
      kw: ["volunteer", "help you", "join", "contact", "who are you", "about chc", "cultural health connect", "voluntario", "contacto", "quienes son", "quiénes son", "تطوع", "التطوع", "تواصل", "من أنتم", "عن المنظمة"],
      a: {
        en: "Cultural Health Connect is a community nonprofit in El Cajon, California. We provide free, evidence-based health education tailored to Middle Eastern and Mexican communities — in English, Spanish, and Arabic.\n\nWant to get involved? We welcome volunteers, healthcare professionals, translators, and local business partners. Visit our <a href='Contact.html'>Contact page</a> to reach out, or learn more on our <a href='about.html'>About page</a>.",
        es: "Cultural Health Connect es una organización comunitaria sin fines de lucro en El Cajón, California. Ofrecemos educación de salud gratuita y basada en evidencia para las comunidades de Medio Oriente y México — en inglés, español y árabe.\n\n¿Quiere participar? Damos la bienvenida a voluntarios, profesionales de la salud, traductores y negocios locales. Visite nuestra <a href='Contact.html'>página de contacto</a> o conozca más en <a href='about.html'>Nosotros</a>.",
        ar: "Cultural Health Connect منظمة مجتمعية غير ربحية في إل كاخون، كاليفورنيا. نقدّم تثقيفاً صحياً مجانياً مبنياً على الأدلة وموجهاً لمجتمعَي الشرق الأوسط والمكسيك — بالإنجليزية والإسبانية والعربية.\n\nهل تودّ المشاركة؟ نرحّب بالمتطوعين والمتخصصين الصحيين والمترجمين والشركاء المحليين. تفضل بزيارة <a href='Contact.html'>صفحة الاتصال</a> أو اعرف المزيد في <a href='about.html'>صفحة عن المنظمة</a>."
      }
    },
    {
      kw: ["hello", "hi ", "hey", "salam", "hola", "buenos dias", "buenas", "مرحبا", "مرحباً", "السلام عليكم", "اهلا", "أهلا"],
      a: {
        en: "Hello! 👋 Ask me anything about healthy eating, exercise, sleep, or stress — or tap one of the suggested questions below.",
        es: "¡Hola! 👋 Pregúnteme lo que quiera sobre alimentación saludable, ejercicio, sueño o estrés — o toque una de las preguntas sugeridas abajo.",
        ar: "مرحباً! 👋 اسألني ما تشاء عن الأكل الصحي أو الرياضة أو النوم أو التوتر — أو اختر أحد الأسئلة المقترحة أدناه."
      }
    },
    {
      kw: ["thank", "thanks", "gracias", "شكرا", "شكراً"],
      a: {
        en: "You're very welcome! Wishing you and your family good health. 💙 Remember — for personal medical questions, your doctor is always the best resource.",
        es: "¡Con mucho gusto! Le deseamos buena salud a usted y a su familia. 💙 Recuerde — para preguntas médicas personales, su médico es siempre el mejor recurso.",
        ar: "على الرحب والسعة! نتمنى لك ولعائلتك دوام الصحة. 💙 وتذكّر — للأسئلة الطبية الشخصية، طبيبك هو دائماً المرجع الأفضل."
      }
    }
  ];

  /* ---------- helpers ---------- */
  function lang() {
    var l = localStorage.getItem("chc-lang") || "en";
    return UI[l] ? l : "en";
  }

  function normalize(s) {
    return s.toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")   // strip Latin accents
      .replace(/[ً-ْـ]/g, "");             // strip Arabic diacritics/tatweel
  }

  function findAnswer(input) {
    var q = " " + normalize(input) + " ";
    for (var i = 0; i < EMERGENCY.length; i++) {
      if (q.indexOf(normalize(EMERGENCY[i])) !== -1) return UI[lang()].emergency;
    }
    var best = null, bestScore = 0;
    KB.forEach(function (topic) {
      var score = 0;
      topic.kw.forEach(function (k) {
        if (q.indexOf(normalize(k)) !== -1) score += k.length; // longer matches weigh more
      });
      if (score > bestScore) { bestScore = score; best = topic; }
    });
    if (best) return best.a[lang()];
    return UI[lang()].fallback;
  }

  /* ---------- widget ---------- */
  var panel, body, input, fabLabel, titleEl, discEl, chipsEl, greeted = false;

  function addMsg(html, who) {
    var div = document.createElement("div");
    div.className = "chc-msg chc-msg-" + who;
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  function botReply(text) {
    var typing = document.createElement("div");
    typing.className = "chc-msg chc-msg-bot chc-typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;
    setTimeout(function () {
      typing.remove();
      addMsg(text, "bot");
    }, 550 + Math.random() * 450);
  }

  function ask(text) {
    if (!text.trim()) return;
    // Collapse the suggestion chips once the visitor starts a conversation,
    // so the message history has room to scroll.
    if (chipsEl) chipsEl.classList.add("chc-chips-hidden");
    addMsg(text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), "user");
    botReply(findAnswer(text));
  }

  function renderChips() {
    chipsEl.innerHTML = "";
    UI[lang()].chips.forEach(function (c) {
      var b = document.createElement("button");
      b.className = "chc-chip";
      b.type = "button";
      b.textContent = c;
      b.addEventListener("click", function () { ask(c); });
      chipsEl.appendChild(b);
    });
  }

  function applyLangToWidget() {
    var t = UI[lang()];
    fabLabel.textContent = t.fab;
    titleEl.textContent = t.title;
    discEl.textContent = t.disclaimer;
    input.placeholder = t.placeholder;
    renderChips();
  }

  function openPanel() {
    panel.classList.add("open");
    if (!greeted) {
      greeted = true;
      botReply(UI[lang()].greeting);
    }
    setTimeout(function () { input.focus(); }, 200);
  }

  // Drag-to-resize from the panel's free corner (top-left in LTR, top-right
  // in RTL, since the panel is anchored to the opposite bottom corner).
  function initResize(handle) {
    var startX, startY, startW, startH;

    function onMove(e) {
      var rtl = document.body.classList.contains("rtl");
      var dw = rtl ? (e.clientX - startX) : (startX - e.clientX);
      var dh = startY - e.clientY;
      var w = Math.min(Math.max(startW + dw, 300), window.innerWidth - 32);
      var h = Math.min(Math.max(startH + dh, 380), window.innerHeight - 110);
      panel.style.width = w + "px";
      panel.style.height = h + "px";
    }

    function onUp() {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      try {
        localStorage.setItem("chc-chat-size", panel.offsetWidth + "x" + panel.offsetHeight);
      } catch (err) { /* storage unavailable — size just won't persist */ }
    }

    handle.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      panel.classList.remove("chc-chat-max"); // manual resize exits maximized mode
      startX = e.clientX;
      startY = e.clientY;
      startW = panel.offsetWidth;
      startH = panel.offsetHeight;
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    });
  }

  function restoreSize() {
    try {
      var saved = localStorage.getItem("chc-chat-size");
      if (!saved) return;
      var parts = saved.split("x");
      var w = parseInt(parts[0], 10), h = parseInt(parts[1], 10);
      if (w >= 300 && h >= 380) {
        panel.style.width = Math.min(w, window.innerWidth - 32) + "px";
        panel.style.height = Math.min(h, window.innerHeight - 110) + "px";
      }
    } catch (err) { /* ignore */ }
  }

  function build() {
    var fab = document.createElement("button");
    fab.className = "chc-chat-fab";
    fab.setAttribute("aria-label", "Open health assistant chat");
    fab.innerHTML = '<span class="fab-dot" aria-hidden="true"></span><i class="bi bi-chat-dots-fill" aria-hidden="true"></i> <span class="chc-fab-label"></span>';
    document.body.appendChild(fab);
    fabLabel = fab.querySelector(".chc-fab-label");

    panel = document.createElement("div");
    panel.className = "chc-chat-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "CHC Health Assistant");
    panel.innerHTML =
      '<div class="chc-chat-resizer" aria-hidden="true" title="Drag to resize"></div>' +
      '<div class="chc-chat-head">' +
        '<div class="chc-chat-head-row">' +
          '<span class="chc-chat-title"><i class="bi bi-heart-pulse" aria-hidden="true"></i> <span class="chc-title-text"></span></span>' +
          '<span>' +
            '<button class="chc-chat-expand" aria-label="Expand chat"><i class="bi bi-arrows-angle-expand" aria-hidden="true"></i></button>' +
            '<button class="chc-chat-close" aria-label="Close chat">✕</button>' +
          '</span>' +
        '</div>' +
        '<div class="chc-chat-disclaimer"></div>' +
      '</div>' +
      '<div class="chc-chat-body"></div>' +
      '<div class="chc-chips"></div>' +
      '<form class="chc-chat-inputrow">' +
        '<input class="chc-chat-input" type="text" autocomplete="off" maxlength="300">' +
        '<button class="chc-chat-send" type="submit" aria-label="Send message">➤</button>' +
      '</form>';
    document.body.appendChild(panel);

    body = panel.querySelector(".chc-chat-body");
    input = panel.querySelector(".chc-chat-input");
    titleEl = panel.querySelector(".chc-title-text");
    discEl = panel.querySelector(".chc-chat-disclaimer");
    chipsEl = panel.querySelector(".chc-chips");

    fab.addEventListener("click", function () {
      if (panel.classList.contains("open")) panel.classList.remove("open");
      else openPanel();
    });
    panel.querySelector(".chc-chat-close").addEventListener("click", function () {
      panel.classList.remove("open");
    });
    panel.querySelector(".chc-chat-expand").addEventListener("click", function () {
      var max = panel.classList.toggle("chc-chat-max");
      this.innerHTML = max
        ? '<i class="bi bi-arrows-angle-contract" aria-hidden="true"></i>'
        : '<i class="bi bi-arrows-angle-expand" aria-hidden="true"></i>';
      this.setAttribute("aria-label", max ? "Restore chat size" : "Expand chat");
    });
    initResize(panel.querySelector(".chc-chat-resizer"));
    restoreSize();
    panel.querySelector(".chc-chat-inputrow").addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value;
      input.value = "";
      ask(v);
    });

    window.addEventListener("chc-lang-changed", applyLangToWidget);
    window.chcOpenAssistant = openPanel;

    applyLangToWidget();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
