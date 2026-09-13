export interface CuratedRulePage {
  pageNumber: number;
  volumeId: number;
  ruleCode: string;
  titleAr: string;
  titleEn: string;
  category: string;
  threatLevel: 'INFO' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ruleQuoteAr: string;
  ruleQuoteEn: string;
  technicalDetailsAr: string;
  technicalDetailsEn: string;
  standardReference: string;
  terminalExercise: {
    command: string;
    expectedOutput: string;
    explanationAr: string;
    explanationEn: string;
  };
  sovereignImpactAr: string;
  sovereignImpactEn: string;
}

export interface InteractiveQuizQuestion {
  id: string;
  questionAr: string;
  questionEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationAr: string;
  explanationEn: string;
  categoryAr: string;
  categoryEn: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم' | 'خبير سيادي';
  hintAr?: string;
  hintEn?: string;
  codeSnippet?: string;
}

export interface CliLabScenario {
  id: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم' | 'خبير سيادي';
  descriptionAr: string;
  descriptionEn: string;
  command: string;
  expectedOutput: string;
  verificationRule: string;
  explanationAr: string;
  explanationEn: string;
}

export interface GlossaryItem {
  id: string;
  termAr: string;
  termEn: string;
  acronym?: string;
  categoryAr: string;
  categoryEn: string;
  definitionAr: string;
  definitionEn: string;
  importanceAr: string;
  importanceEn: string;
  standard: string;
}

export interface BookVolume {
  id: number;
  titleAr: string;
  titleEn: string;
  pagesRange: string;
  startPage: number;
  endPage: number;
  summaryAr: string;
  summaryEn: string;
  keyTopics: string[];
  quizzes: InteractiveQuizQuestion[];
}

export const ACADEMY_VOLUMES: BookVolume[] = [
  {
    id: 1,
    titleAr: 'المجلد الأول: التأسيس ومعمارية النظم وبروتوكولات الشبكات',
    titleEn: 'Volume I: Foundations, System Architecture & Network Protocols',
    pagesRange: '1 - 450',
    startPage: 1,
    endPage: 450,
    summaryAr: 'تفصيل عميق لنموذج OSI، بروتوكولات TCP/IP، مصافحات SYN/ACK، إدارة ذاكرة النواة، وهندسة المعالجات x86_64 و ARM.',
    summaryEn: 'Exhaustive exploration of OSI stack, TCP/UDP sockets, kernel memory paging, and hardware processor architectures.',
    keyTopics: ['TCP/IP Handshakes', 'Linux Kernel Memory', 'Socket Architecture', 'OSI 7 Layers', 'Assembly Basics'],
    quizzes: [
      {
        id: 'v1_q1',
        categoryAr: 'بروتوكولات الشبكة والمنافذ',
        categoryEn: 'Network Protocols & Sockets',
        difficulty: 'مبتدئ',
        questionAr: 'ما هي الخطوات الثلاث الدقيقة لمصافحة بروتوكول TCP الثلاثية (3-Way Handshake) لإنشاء اتصال موثوق؟',
        questionEn: 'What are the three sequential steps of the TCP 3-Way Handshake to establish a reliable stream?',
        optionsAr: [
          'SYN -> SYN-ACK -> ACK',
          'ACK -> SYN -> RST',
          'FIN -> ACK -> FIN-ACK',
          'HELLO -> AUTH -> CONNECT'
        ],
        optionsEn: [
          'SYN -> SYN-ACK -> ACK',
          'ACK -> SYN -> RST',
          'FIN -> ACK -> FIN-ACK',
          'HELLO -> AUTH -> CONNECT'
        ],
        correctIndex: 0,
        explanationAr: 'يرسل العميل أولاً حزمة مزامنة (SYN)، فيرد الخادم بحزمة تأكيد المزامنة (SYN-ACK)، ثم يؤكد العميل الاتصال بحزمة (ACK). تفعيل SYN Cookies يحمي الخادم من نفاد الذاكرة في هجمات الإغراق.',
        explanationEn: 'The client transmits SYN, server responds with SYN-ACK, and client completes with ACK. SYN Cookies safeguard host memory against backlog exhaustion.'
      },
      {
        id: 'v1_q2',
        categoryAr: 'أمن أنظمة لينكس والنواة',
        categoryEn: 'Linux Kernel & System Security',
        difficulty: 'متوسط',
        questionAr: 'لماذا يُمنع تشغيل الخدمات الحيوية بحساب الجذر المطلق (root) في معمارية النظم الدفاعية؟',
        questionEn: 'Why must critical services never execute under the root user in defensive architectures?',
        optionsAr: [
          'لأن حساب root يبطئ معالجة حزم الشبكة بنسبة 50%.',
          'لأنه في حال استغلال ثغرة في التطبيق، يحصل المهاجم فوراً على سيطرة كاملة على النواة والملفات ومقابس الشبكة.',
          'لأن حساب root لا يدعم التشفير عبر بروتوكول TLS.',
          'لأن لينكس يغلق حساب root تلقائياً بعد ساعتين من العمل.'
        ],
        optionsEn: [
          'Because root slows down network packet processing by 50%.',
          'Because exploiting an app flaw instantly grants the adversary total takeover of kernel, storage, and raw sockets.',
          'Because root does not support TLS cryptography.',
          'Because Linux shuts down root automatically after 2 hours.'
        ],
        correctIndex: 1,
        explanationAr: 'تطبيق مبدأ الصلاحيات الأدنى (Least Privilege) وعزل العمليات داخل مستخدمين مخصصين بمجموعات صلاحيات مسلوبة يمنع انهيار النظام بأكمله إذا نجح المهاجم في استغلال ثغرة في الخدمة.',
        explanationEn: 'Principle of Least Privilege confines adversaries to restricted user sandboxes, denying kernel takeover even upon arbitrary remote code execution.'
      },
      {
        id: 'v1_q3',
        categoryAr: 'تحليل حركة البيانات والتقاط الحزم',
        categoryEn: 'Packet Analysis & Inspection',
        difficulty: 'متوسط',
        questionAr: 'عند التقاط حزم البيانات عبر شبكة محلية غير مشفرة باستخدام tcpdump، ما هي البيانات التي تكون مكشوفة للمتنصت؟',
        questionEn: 'When capturing plaintext network packets with tcpdump on an unencrypted segment, what data is visible to an eavesdropper?',
        optionsAr: [
          'فقط عناوين IP للمرسل والمستقبل.',
          'كل حمولة الحزمة بما فيها كلمات المرور، النصوص البرمجية، ورموز الجلسات (Sessions/Cookies).',
          'لا شيء لأن بطاقة الشبكة تشفر البيانات تلقائياً.',
          'فقط رقم المنفذ دون أي تفاصيل أخرى.'
        ],
        optionsEn: [
          'Only source and destination IP headers.',
          'The entire payload including plaintext credentials, raw queries, and session authentication cookies.',
          'Nothing because NIC drivers auto-encrypt all hardware traffic.',
          'Only port numbers without payload details.'
        ],
        correctIndex: 1,
        explanationAr: 'حزم البيانات غير المشفرة (Plaintext) مثل HTTP و FTP و Telnet تُرسل نصوصاً صريحة يستطيع أي جهاز على نفس مقطع الشبكة قراءتها بالكامل، ولهذا يعتبر فرض TLS 1.3 إلزامياً في ميثاق طه الستري.',
        explanationEn: 'Plaintext streams transmit unprotected bytes readable by any promiscuous socket listener, mandating end-to-end TLS 1.3 encryption.'
      }
    ]
  },
  {
    id: 2,
    titleAr: 'المجلد الثاني: الاستطلاع السيبراني والاستخبارات مفتوحة المصدر (OSINT)',
    titleEn: 'Volume II: Cyber Reconnaissance & Open Source Intelligence',
    pagesRange: '451 - 980',
    startPage: 451,
    endPage: 980,
    summaryAr: 'تقنيات رسم خرائط الأهداف، تحليل سجلات DNS، مسح المنافذ الخفي، كشف الأصول الرقمية المهملة، والامتثال لقوانين CNDP/DGSSI بالمغرب.',
    summaryEn: 'Target surface mapping, passive DNS footprinting, stealth Nmap reconnaissance, and Moroccan regulatory compliance.',
    keyTopics: ['DNS Recon', 'Stealth SYN Scans', 'OSINT Frameworks', 'Shodan IoT Mapping', 'Legal Scopes (CNDP)'],
    quizzes: [
      {
        id: 'v2_q1',
        categoryAr: 'الاستخبارات مفتوحة المصدر (OSINT)',
        categoryEn: 'OSINT & Reconnaissance',
        difficulty: 'متوسط',
        questionAr: 'ما هي الميزة التشغيلية الأبرز للاستطلاع السلبي (Passive Reconnaissance) مقارنة بالفحص النشط؟',
        questionEn: 'What is the primary operational advantage of passive reconnaissance over active vulnerability scanning?',
        optionsAr: [
          'أنه أسرع بمليون مرة من الفحص المباشر.',
          'أنه لا يرسل أي حزم مباشرة إلى خوادم الهدف، مما يجعله خفياً تماماً ومتوافقاً مع ضوابط عدم الاشتباك والقوانين الجنائية.',
          'أنه يغني عن معرفة لغات البرمجة.',
          'أنه يغير سجلات DNS للهدف مباشرة.'
        ],
        optionsEn: [
          'It executes one million times faster than active scanning.',
          'It transmits zero packets directly to the target, remaining invisible in intrusion logs and compliant with legal engagement rules.',
          'It removes the need to understand programming languages.',
          'It automatically modifies the target DNS zone records.'
        ],
        correctIndex: 1,
        explanationAr: 'الاستطلاع السلبي يجمع البيانات من مخازن خارجية مثل Certificate Transparency و Shodan و BGP دون ملامسة خادم الهدف، ما يجنب الفريق الأخلاقي شبهة الهجوم غير المصرح به.',
        explanationEn: 'Passive reconnaissance gathers intelligence via public mirrors and certificate transparency without transmitting directly, avoiding detection and legal violations.'
      },
      {
        id: 'v2_q2',
        categoryAr: 'فحص الشبكات والمنافذ بـ Nmap',
        categoryEn: 'Nmap Scanning Mechanics',
        difficulty: 'متقدم',
        questionAr: 'كيف يعمل فحص التسلل SYN Stealth Scan (-sS) في أداة Nmap؟',
        questionEn: 'How does Nmap SYN Stealth Scan (-sS) operate on the network layer?',
        optionsAr: [
          'يرسل حزمة SYN، وإذا رد الخادم بـ SYN-ACK يرسل Nmap حزمة RST لقطع الاتصال فوراً قبل إتمام المصافحة وتسجيل الجلسة في التطبيق.',
          'يقوم بتحميل فيروس في ذاكرة الخادم.',
          'يغلق جميع منافذ الضحية لمنع دخول أي مستخدم آخر.',
          'يقوم بفك تشفير شهادات SSL تلقائياً.'
        ],
        optionsEn: [
          'Sends SYN, and if the target replies SYN-ACK, Nmap responds with RST to teardown the socket before completing connection or logging.',
          'Injects a payload into target memory.',
          'Closes all remote victim ports.',
          'Automatically cracks TLS certificates.'
        ],
        correctIndex: 0,
        explanationAr: 'فحص SYN يسمى "نصف المفتوح" (Half-Open) لأنه لا يكمل المصافحة الثلاثية، فبمجرد علمه بأن المنفذ مفتوح يرسل حزمة RST لإلغاء الاتصال قبل أن تسجله خدمات الطبقة السابعة.',
        explanationEn: 'Half-open SYN scans teardown the handshake with RST prior to completion, preventing application-level connection logging.'
      },
      {
        id: 'v2_q3',
        categoryAr: 'الأطر القانونية والتشريعية',
        categoryEn: 'Cyber Legislation & Ethics',
        difficulty: 'مبتدئ',
        questionAr: 'في المملكة المغربية، ما هو المرجع القانوني الرئيسي الذي يجرم الدخول غير المصرح به للأنظمة المعلوماتية؟',
        questionEn: 'In Morocco, which legal statute specifically criminalizes unauthorized access to automated data processing systems?',
        optionsAr: [
          'القانون الجنائي رقم 07-03 المتمم لمجموعة القانون الجنائي والمتعلق بالجرائم الماسة بأنظمة المعالجة الآلية للمعطيات.',
          'قانون السير على الطرقات.',
          'مرسوم تنظيم الصيد البحري.',
          'قانون حماية المستهلك فقط دون عقوبات سجنية.'
        ],
        optionsEn: [
          'Moroccan Penal Law No. 07-03 relating to automated data processing offenses.',
          'Highway Traffic Code.',
          'Maritime Fishing Regulation.',
          'Civil Consumer Protection Act without penal penalties.'
        ],
        correctIndex: 0,
        explanationAr: 'القانون 07-03 يعاقب بالحبس والغرامة كل من دخل إلى نظام معالجة آلية للمعطيات عن طريق الاحتيال أو بقي فيه عن غير حق، وتوجيهات DGSSI تؤكد وجوب الحصول على تفويض كتابي قبل أي فحص أمني.',
        explanationEn: 'Law 07-03 mandates severe criminal penalties for unauthorized penetration or tampering, reinforcing the strict necessity of authorized testing mandates.'
      }
    ]
  },
  {
    id: 3,
    titleAr: 'المجلد الثالث: اختبار الاختراق المتقدم وثغرات الويب والتطبيقات',
    titleEn: 'Volume III: Advanced Penetration Testing & Web Application Flaws',
    pagesRange: '981 - 1520',
    startPage: 981,
    endPage: 1520,
    summaryAr: 'تشريح معايير OWASP Top 10، حقن قواعد البيانات (SQLi)، ثغرات Cross-Site Scripting (XSS)، كسر الجلسات، واختبار واجهات REST & GraphQL.',
    summaryEn: 'Deep architectural dissect of OWASP Top 10, SQL injection, stored/reflected XSS, session fixation, and API vulnerabilities.',
    keyTopics: ['SQL Injection', 'Cross-Site Scripting (XSS)', 'SSRF & CSRF', 'JWT Cryptographic Breaks', 'API Security'],
    quizzes: [
      {
        id: 'v3_q1',
        categoryAr: 'أمن تطبيقات الويب وقواعد البيانات',
        categoryEn: 'Web App & Database Security',
        difficulty: 'متوسط',
        questionAr: 'لماذا يعتبر استخدام Prepared Statements هو الحل الجذري والنهائي لمنع ثغرات حقن SQL (SQL Injection)؟',
        questionEn: 'Why are Prepared Statements considered the definitive mathematical remedy against SQL Injection?',
        optionsAr: [
          'لأنها تشفر قاعدة البيانات بالكامل بمفتاح سري.',
          'لأنها تفصل هيكل كود الاستعلام النحوي عن قيم المتغيرات، بحيث تُعامل مدخلات المستخدم كبيانات حرفية غير قابلة للتنفيذ كأمر برمجي.',
          'لأنها تمنع المستخدمين من إدخال أي حروف خاصة.',
          'لأنها تحذف أوامر DROP و DELETE من نظام التشغيل.'
        ],
        optionsEn: [
          'Because they fully encrypt the entire relational database.',
          'Because they decouple pre-compiled query syntax from input parameters, treating user variables strictly as inert literal data.',
          'Because they ban all special characters.',
          'Because they permanently erase DROP and DELETE commands from the OS.'
        ],
        correctIndex: 1,
        explanationAr: 'الاستعلامات المجهزة تترجم النحو المنطقي للاستعلام أولاً (Abstract Syntax Tree)، ثم تقحم قيم المتغيرات لاحقاً في أماكن مخصصة، فلا يمكن لأي نص مدخل تغيير منطق الاستعلام مهما احتوى على علامات تنصيص.',
        explanationEn: 'Prepared queries compile the abstract syntax tree prior to parameter binding, rendering malicious syntax characters inert text strings.'
      },
      {
        id: 'v3_q2',
        categoryAr: 'ثغرات XSS وأمن المتصفح',
        categoryEn: 'XSS & Client Security',
        difficulty: 'متقدم',
        questionAr: 'ما هو دور علامة الترويسة (HttpOnly flag) عند ضبط ملفات تعريف الارتباط الخاصة بالجلسات (Cookies)؟',
        questionEn: 'What is the exact defensive role of the HttpOnly cookie flag in session defense?',
        optionsAr: [
          'تسمح بنقل الكوكيز عبر شبكات الجوال فقط.',
          'تمنع كود جافاسكريبت داخل المتصفح (مثل document.cookie) من قراءة الجلسة، مما يحمي الرمز من السرقة في حال وقوع ثغرة XSS.',
          'تزيد من سرعة تحميل صفحات الموقع.',
          'تمنع المستخدم من تسجيل الخروج.'
        ],
        optionsEn: [
          'It restricts cookie transmission exclusively to mobile cell towers.',
          'It denies browser JavaScript (document.cookie) access to the token, safeguarding session credentials from theft during XSS exploits.',
          'It speeds up web page asset caching.',
          'It prohibits user logout actions.'
        ],
        correctIndex: 1,
        explanationAr: 'علامة HttpOnly تمنع محرك الجافاسكريبت بالمتصفح من الوصول للكوكي نهائياً، مما يحرم المهاجم من سرقة جلسة المستخدم حتى لو نجح في حقن كود خبيث عبر ثغرة XSS.',
        explanationEn: 'HttpOnly instructs browsers to isolate session cookies from document.cookie JavaScript calls, mitigating token exfiltration during XSS incidents.'
      },
      {
        id: 'v3_q3',
        categoryAr: 'أمن واجهات البرمجة والرموز الرقمية (JWT)',
        categoryEn: 'API & JWT Token Security',
        difficulty: 'متقدم',
        questionAr: 'في هجمات تزوير رموز JWT، ما هي الثغرة الخطيرة المعروفة باسم "None Algorithm Attack"؟',
        questionEn: 'In JWT token authentication flaws, what constitutes the critical "None Algorithm" vulnerability?',
        optionsAr: [
          'تشفير الرمز بـ 1024 بت.',
          'قبول الخادم لرمز يحتوي في ترويسته على alg: none والتعامل معه كمصادقة صالحة دون التحقق من التوقيع الرقمي إطلاقاً.',
          'حذف تاريخ انتهاء صلاحية الرمز.',
          'إرسال الرمز عبر بروتوكول UDP.'
        ],
        optionsEn: [
          'Encrypting the token payload with 1024 bits.',
          'A vulnerable server accepting alg: "none" in the JWT header, skipping cryptographic signature verification and trusting forged roles.',
          'Omitting token expiration timestamps.',
          'Transmitting the payload over UDP.'
        ],
        correctIndex: 1,
        explanationAr: 'عندما تفشل مكتبة التحقق في رفض خوارزمية "none"، يستطيع المهاجم تعديل دوره إلى "admin" وحذف التوقيع، فيقبل الخادم الرمز المصطنع. الحل هو فرض خوارزمية توقيع صارمة (مثل Ed25519 أو RS256) في كود الخادم.',
        explanationEn: 'Vulnerable token libraries treat alg: none as valid, accepting unsigned attacker payloads. Servers must strictly enforce asymmetric algorithms.'
      }
    ]
  },
  {
    id: 4,
    titleAr: 'المجلد الرابع: أمن الحوسبة السحابية والبنية التحتية والحاويات',
    titleEn: 'Volume IV: Cloud Infrastructure, Containerization & Kubernetes Hardening',
    pagesRange: '1521 - 2050',
    startPage: 1521,
    endPage: 2050,
    summaryAr: 'تشديد أمان حاويات Docker، عزل مجموعات Kubernetes عبر RBAC وسياسات الشبكة، تأمين السحابة الهجينة، وإدارة الأسرار والتشفير أثناء النقل.',
    summaryEn: 'Hardening container namespaces, Kubernetes Pod Security Standards, cloud VPC isolation, and cryptographic secret management.',
    keyTopics: ['Docker Seccomp/AppArmor', 'Kubernetes NetworkPolicies', 'AWS/GCP/Azure IAM', 'HashiCorp Vault', 'CI/CD Pipelines'],
    quizzes: [
      {
        id: 'v4_q1',
        categoryAr: 'أمن الحاويات وتجريد الصلاحيات',
        categoryEn: 'Container Hardening & Isolation',
        difficulty: 'متقدم',
        questionAr: 'ما هي الخطورة الكبرى لتشغيل حاوية Docker بالخيار المفرط (--privileged)؟',
        questionEn: 'What is the critical risk of running a Docker container with the --privileged flag?',
        optionsAr: [
          'تستهلك الحاوية مساحة أكبر على القرص الصلب.',
          'تمنح الحاوية إمكانية الوصول المباشر لكافة أجهزة النواة وتلغي قيود seccomp و cgroups، مما يتيح الهروب من الحاوية والسيطرة على الخادم المضيف.',
          'تتوقف الحاوية عن الاتصال بالإنترنت.',
          'تمنع إضافة أي متغيرات بيئية جديدة.'
        ],
        optionsEn: [
          'The container consumes additional disk capacity.',
          'It grants raw access to all host devices and disables seccomp/cgroup boundaries, facilitating immediate container breakout into host kernel.',
          'The container loses internet connectivity.',
          'It prevents loading new environment variables.'
        ],
        correctIndex: 1,
        explanationAr: 'خيار --privileged يسقط جدران العزل بين الحاوية والمضيف، فيستطيع المهاجم تركيب أقراص الخادم الحقيقي والسيطرة على نظام التشغيل الأساسي بالكامل.',
        explanationEn: 'Privileged mode strips container confinement, providing raw hardware access and trivial root privilege escalation to the underlying host system.'
      },
      {
        id: 'v4_q2',
        categoryAr: 'عزل مجموعات Kubernetes والشبكات الافتراضية',
        categoryEn: 'Kubernetes Network Policies',
        difficulty: 'خبير سيادي',
        questionAr: 'ما هو السلوك الافتراضي لشبكات مجموعات Kubernetes في حال عدم تطبيق أي سياسات شبكة (NetworkPolicy)؟',
        questionEn: 'What is the default routing behavior in a Kubernetes cluster when no NetworkPolicies are applied?',
        optionsAr: [
          'كافة الحاويات معزولة تماماً ولا تستطيع التحدث مع بعضها.',
          'كل حاوية (Pod) تستطيع الاتصال بأي حاوية أخرى في أي مساحة أسماء (Namespace) دون أي قيد أو ترشيح.',
          'يُسمح فقط بحركة المرور المشفرة عبر HTTPS.',
          'تتوقف خوادم Kubernetes عن استقبال الطلبات الخارجية.'
        ],
        optionsEn: [
          'All pods operate in complete isolation without inter-pod routing.',
          'Flat network topology: every pod can communicate freely with every other pod across all namespaces without filtering.',
          'Only HTTPS encrypted traffic is routed.',
          'The cluster control plane refuses incoming ingress.'
        ],
        correctIndex: 1,
        explanationAr: 'افتراضياً شبكة كوبرنيتس مفتوحة ومسطحة، فإذا اخترق المهاجم خدمة ويب بسيطة يستطيع التسلل جانبياً لقاعدة البيانات ولوحة التحكم ما لم تُطبق سياسات NetworkPolicy صارمة بمبدأ الحظر التلقائي (Default Deny).',
        explanationEn: 'Kubernetes features an unsegmented flat network by default. Zero-trust mandates an explicit Default-Deny ingress/egress NetworkPolicy.'
      },
      {
        id: 'v4_q3',
        categoryAr: 'إدارة المفاتيح والأسرار السحابية',
        categoryEn: 'Secrets Management & HSM',
        difficulty: 'متوسط',
        questionAr: 'لماذا يعتبر تضمين مفاتيح API وكلمات المرور داخل كود المشروع أو ملفات Dockerfile ممارسة أمنية فادحة؟',
        questionEn: 'Why is hardcoding API secrets or credentials into source repositories or Dockerfiles a severe vulnerability?',
        optionsAr: [
          'لأنها تزيد من حجم ملف الكود ببايتات معدودة.',
          'لأنها تُحفظ في طبقات صور Docker وسجلات Git التاريخية وتبقى قابلة للاستخراج حتى بعد حذفها من الملف الأخير.',
          'لأن الخادم لن يقبل ترجمة الكود إطلاقاً.',
          'لأنها تجعل النظام متوافقاً فقط مع لغة بايثون.'
        ],
        optionsEn: [
          'Because it increases code size by several bytes.',
          'Because secrets persist immutably within Docker image layers and Git commit trees, remaining extractable indefinitely.',
          'Because compilers reject hardcoded tokens.',
          'Because it restricts compatibility strictly to Python.'
        ],
        correctIndex: 1,
        explanationAr: 'طبقات صور الحاويات وسجلات الـ Git تحفظ كل خطوة تمت سابقاً، فأي مفتاح أُدخل في ملف سيبقى مدفوناً في الطبقات ويمكن لأي باحث استخراجه بسهولة. المعيار السيادي يفرض حقن الأسرار وقت التشغيل فقط عبر Vault.',
        explanationEn: 'Git commit history and container image layers are immutable caches; deleted secrets remain recoverable. Runtime injection via Vault is mandatory.'
      }
    ]
  },
  {
    id: 5,
    titleAr: 'المجلد الخامس: الدفاع السيبراني السيادي، برمجة النواة eBPF وتشفير ما بعد الكم',
    titleEn: 'Volume V: Sovereign Kernel Defense (eBPF/XDP) & Post-Quantum Cryptography',
    pagesRange: '2051 - 2680',
    startPage: 2051,
    endPage: 2680,
    summaryAr: 'بناء دفاعات سلكية على بطاقات الشبكة (Wire-speed XDP)، اعتراض هجمات DDoS والـ Ransomware في أقل من 300ms، وتطبيق خوارزميات NIST FIPS 203/204.',
    summaryEn: 'Sub-300ms kernel wire-speed packet filtering with eBPF/XDP, statistical Shannon entropy anomaly detection, and NIST Post-Quantum lattice algorithms.',
    keyTopics: ['eBPF / XDP Drivers', 'Sub-second DDoS Drop', 'Shannon Entropy Engine', 'NIST ML-KEM-1024', 'Lattice Cryptography'],
    quizzes: [
      {
        id: 'v5_q1',
        categoryAr: 'برمجة النواة eBPF وسرعة السلك XDP',
        categoryEn: 'Kernel eBPF / XDP Architecture',
        difficulty: 'خبير سيادي',
        questionAr: 'ما الذي يجعل تقنية eXpress Data Path (XDP) قادرة على إسقاط عشرات ملايين حزم الهجمات في الثانية بدون استنزاف موارد الخادم؟',
        questionEn: 'What enables eXpress Data Path (XDP) to neutralize tens of millions of attack packets per second without exhausting host resources?',
        optionsAr: [
          'أنها تعمل في برنامج تعريف بطاقة الشبكة (NIC Driver) قبل تخصيص بنية sk_buff في ذاكرة النواة وقبل استدعاء مكدس TCP/IP.',
          'أنها تستخدم الذكاء الاصطناعي لحظر الإنترنت عن الدول المعادية.',
          'أنها تلغي حزم IPv4 تماماً.',
          'أنها تنقل الخادم إلى مدار فضائي خارج الغلاف الجوي.'
        ],
        optionsEn: [
          'It executes verified bytecode inside the NIC driver ring buffer before socket sk_buff memory allocation and kernel network stack entry.',
          'It relies on AI to ban hostile national domains.',
          'It completely disables IPv4 protocols.',
          'It routes server hardware to orbital satellite links.'
        ],
        correctIndex: 0,
        explanationAr: 'العبقرية في XDP تكمن في قرار الإسقاط (XDP_DROP) فور وصول البايتات إلى بطاقة الشبكة، دون تخصيص بايت واحد من ذاكرة النواة ودون إشراك مكدس الشبكة، مما يمنحها سرعة معالجة سلكية لا تضاهى.',
        explanationEn: 'XDP_DROP neutralizes incoming packets in the driver ring buffer before socket metadata allocation, preserving host CPU and memory completely.'
      },
      {
        id: 'v5_q2',
        categoryAr: 'كشف الشذوذ الرياضي وإنتروبيا شانون',
        categoryEn: 'Shannon Entropy & Anomaly Detection',
        difficulty: 'متقدم',
        questionAr: 'كيف تستفيد منظومات الدفاع السيبراني السيادية من حساب إنتروبيا شانون (Shannon Entropy) لكشف برمجيات الفدية؟',
        questionEn: 'How do sovereign defense frameworks leverage Shannon Entropy calculations to expose active ransomware tunnels?',
        optionsAr: [
          'تقيس درجة الفوضى العشوائية في حزم البيانات؛ لأن الملفات المشفرة قسراً وحركات تسريب البيانات تتسم بإنتروبيا عالية جداً (تقارب 8.0) مقارنة بالبيانات العادية.',
          'تقوم بحساب عدد كلمات المرور المكتوبة باللغة العربية.',
          'تحسب المسافة الجغرافية بين الخادم والمهاجم.',
          'تحدد سرعة دوران مروحة المعالج.'
        ],
        optionsEn: [
          'Measures algorithmic byte distribution randomness: encrypted ransomware writes and exfiltration tunnels exhibit elevated entropy (~8.0) against benign baselines.',
          'Calculates word frequency counts.',
          'Measures physical geography between nodes.',
          'Inspects CPU fan speeds.'
        ],
        correctIndex: 0,
        explanationAr: 'البيانات المشفرة بالبرمجيات الخبيثة تتميز بتوزيع بايتات عشوائي متجانس يقترب من الإنتروبيا القصوى (8 بت لكل بايت). رصد هذا الارتفاع اللحظي يطلق إنذار العزل في أقل من 300 ميلي ثانية.',
        explanationEn: 'High-entropy clusters (H ≈ 8.0) mathematically betray encrypted ransomware activity and covert channels without needing signature signatures.'
      },
      {
        id: 'v5_q3',
        categoryAr: 'التشفير المقاوم للكم (Post-Quantum Cryptography)',
        categoryEn: 'Post-Quantum NIST Standards',
        difficulty: 'خبير سيادي',
        questionAr: 'ما هو الخطر الداهم المسمى "Harvest Now, Decrypt Later" والذي جعل اعتماد معيار NIST FIPS 203 (ML-KEM) أمراً عاجلاً اليوم؟',
        questionEn: 'What existential threat does "Harvest Now, Decrypt Later" represent, accelerating NIST FIPS 203 (ML-KEM) deployment today?',
        optionsAr: [
          'أن القراصنة يخزنون البيانات المشفرة حالياً بـ RSA/ECC بانتظار اكتمال الحواسيب الكمومية لفك تشفيرها مستقبلاً بخوارزمية شور (Shor\'s Algorithm).',
          'أن حواسيب الكم ستلغي الكهرباء في العالم.',
          'أن التشفير سينتهي عام 2030.',
          'أن خوارزميات الكم تعمل فقط على الهواتف الذكية.'
        ],
        optionsEn: [
          'Adversaries harvest encrypted RSA/ECC traffic today to retroactively decrypt state secrets once cryptanalytically relevant quantum computers run Shor\'s algorithm.',
          'Quantum computers will shut down global electrical grids.',
          'Encryption will cease to exist by 2030.',
          'Quantum attacks execute strictly on mobile phones.'
        ],
        correctIndex: 0,
        explanationAr: 'المعلومات الاستخباراتية والأسرار البنكية المسروقة اليوم قد تظل حساسة لعقود؛ لذا يضمن التشفير الشبكي المقاوم للكم أن البيانات المخزنة لن يتمكن أي حاسوب كمومي مستقبلي من فكها أبداً.',
        explanationEn: 'Data harvested today remains sensitive for decades. Post-quantum lattice algorithms ensure retrospective immunity against Shor\'s quantum factorization.'
      }
    ]
  },
  {
    id: 6,
    titleAr: 'المجلد السادس: الاستجابة للحوادث، التحقيق الجنائي الرقمي والمعايير الوطنية',
    titleEn: 'Volume VI: Incident Response, Digital Forensics (DFIR) & National Sovereignty',
    pagesRange: '2681 - 3250',
    startPage: 2681,
    endPage: 3250,
    summaryAr: 'إجراءات عزل التهديدات في 15 دقيقة، استخراج أدلة الذاكرة الحية (RAM Forensics)، سلاسل الكتل المقاومة للتلاعب، وتوجيهات المديرية العامة لأمن نظم المعلومات (DGSSI).',
    summaryEn: '15-minute containment protocols, Volatility memory dumping, Merkle Tree tamper-proof audit trails, and DGSSI Moroccan cybersecurity directives.',
    keyTopics: ['DFIR Protocols', 'Memory Volatility', 'Merkle Tree Audits', 'DGSSI Directives', 'ISO 27001 Lead Audit'],
    quizzes: [
      {
        id: 'v6_q1',
        categoryAr: 'التحقيق الجنائي الرقمي واستخراج الذاكرة (DFIR)',
        categoryEn: 'Digital Forensics & Memory Triage',
        difficulty: 'متقدم',
        questionAr: 'عند وقوع حادث اختراق على خادم حساس، لماذا يمنع بروتوكول التحقيق الجنائي الرقمي إعادة تشغيل الجهاز (Reboot) فوراً؟',
        questionEn: 'Upon detecting a major breach, why do digital forensic protocols strictly prohibit immediately rebooting the infected host?',
        optionsAr: [
          'لأن إعادة التشغيل تحذف بيانات الذاكرة الحية (RAM Volatile Data) حيث توجد مفاتيح التشفير، والعمليات الخفية، وعناوين اتصال المهاجم.',
          'لأن نظام التشغيل سيفقد رخصته التجارية.',
          'لأن ذلك يقلل من عمر المعالج الافتراضي.',
          'لأن إعادة التشغيل ترسل إشعاراً للمهاجم تلقائياً.'
        ],
        optionsEn: [
          'Because rebooting purges volatile RAM state, permanently destroying injection payloads, active sockets, and ephemeral cryptographic keys.',
          'Because commercial OS licenses are forfeited.',
          'Because it reduces physical CPU lifespan.',
          'Because rebooting notifies the adversary.'
        ],
        correctIndex: 0,
        explanationAr: 'ذاكرة RAM تحتوي على أهم الأدلة الجنائية التي لم تُكتب على القرص (مثل برمجيات التسلل غير المكتوبة على القرص Fileless Malware ومفاتيح فك التشفير). يجب أخذ صورة كاملة للذاكرة أولاً قبل أي إجراء.',
        explanationEn: 'Volatile RAM holds vital evidence: injected dlls, process memory maps, and encryption keys. Acquiring memory dumps via LiME/WinPmem must precede any shutdown.'
      },
      {
        id: 'v6_q2',
        categoryAr: 'نزاهة السجلات وسلاسل ميركل المقاومة للتلاعب',
        categoryEn: 'Cryptographic Audit Integrity (Merkle Trees)',
        difficulty: 'خبير سيادي',
        questionAr: 'كيف تضمن شجرة ميركل المشفرة (Cryptographic Merkle Tree) أن سجلات الأمان (Audit Logs) لم يتم التلاعب بها من قبل المهاجم بعد الاختراق؟',
        questionEn: 'How does a Cryptographic Merkle Tree guarantee that security audit logs have not been retroactively altered by an intruder?',
        optionsAr: [
          'بربط كل سجل ببصمة تجزئة تعتمد رياضياً على السجلات السابقة، فأي تغيير في سطر واحد يغير جذر الشجرة (Root Hash) ويفضح التلاعب فوراً.',
          'بإخفاء السجلات داخل ملف صورة سرية.',
          'بإرسال رسالة SMS للمسؤول عند كل سطر جديد.',
          'بتخزين السجلات على بطاقة ذاكرة غير قابلة للمسح فقط.'
        ],
        optionsEn: [
          'By hashing log events recursively into a cryptographic root hash; altering any historical byte mutates the tree root and exposes tampering.',
          'By steganographically concealing logs in images.',
          'By sending an SMS message per log line.',
          'By utilizing write-once flash drives only.'
        ],
        correctIndex: 0,
        explanationAr: 'شجرة ميركل توفر دليلاً رياضياً غير قابل للكسر لنزاهة البيانات؛ لأن تغيير حرف واحد في سجل قديم سيغير تجزئة العقدة وتجزئة الجذر، مما يثبت التلاعب أمام المحاكم والجهات التنظيمية.',
        explanationEn: 'Merkle trees link sequential log hashes into an immutable root. Any tampering invalidates cryptographic verification proofs instantly.'
      },
      {
        id: 'v6_q3',
        categoryAr: 'السيادة الوطنية والمعايير التنظيمية بالمغرب',
        categoryEn: 'Moroccan Sovereign Cyber Directives',
        difficulty: 'متوسط',
        questionAr: 'ما هو الدور السيادي للمديرية العامة لأمن نظم المعلومات (DGSSI) بالمملكة المغربية؟',
        questionEn: 'What is the sovereign mission of the General Directorate of Information Systems Security (DGSSI) in Morocco?',
        optionsAr: [
          'بيع أجهزة الكمبيوتر للمواطنين.',
          'وضع وتطبيق الاستراتيجية الوطنية للأمن السيبراني، حماية البنى التحتية الحيوية، وتوجيه ومراقبة نظم معلومات الهيئات العامة والخاصة.',
          'إصدار بطاقات التعريف الوطنية فقط.',
          'تنظيم المسابقات الرياضية الرقمية.'
        ],
        optionsEn: [
          'Selling desktop computers to citizens.',
          'Formulating and enforcing the national cybersecurity framework, safeguarding critical infrastructure, and auditing sovereign IT systems.',
          'Issuing civil identity cards exclusively.',
          'Managing e-sports championships.'
        ],
        correctIndex: 1,
        explanationAr: 'الـ DGSSI هي السلطة الوطنية العليا المسؤولة عن أمن الفضاء السيبراني بالمغرب، وتحدد المعايير الإلزامية لحماية المنشآت ذات الأهمية الحيوية وضمان السيادة الرقمية الكاملة للمملكة.',
        explanationEn: 'DGSSI is the national cybersecurity authority in Morocco, governing critical infrastructure resilience, national defense standards, and sovereign cryptographic directives.'
      }
    ]
  }
];

export const LANDMARK_CODEX_PAGES: Record<number, CuratedRulePage> = {
  1: {
    pageNumber: 1,
    volumeId: 1,
    ruleCode: 'RULE-001-FOUNDATION',
    titleAr: 'القاعدة السيادية الأولى: السيادة الرقمية والحماية من نقطة الصفر',
    titleEn: 'Sovereign Rule 001: Ground Zero Independence & Cyber Sovereignty',
    category: 'الفلسفة والمعمارية السيادية',
    threatLevel: 'INFO',
    ruleQuoteAr: '«السيادة الرقمية لا تُمنح ولا تُشترى بحلول خارجية جاهزة؛ بل تُبنى في النواة وتُحمى بأيدي مهندسين وطنيين يدركون كل بت يعبر كوابلهم.» — طه الستري',
    ruleQuoteEn: '“Digital sovereignty is neither leased nor purchased; it is compiled in the kernel and protected by national engineers who master every bit flowing through their wires.” — TAHA SETRII',
    technicalDetailsAr: 'تنص هذه القاعدة على وجوب خضوع أي حل أمني لنظام التدقيق المغلق، حيث لا يُسمح بإرسال أي مفاتيح تشفير أو سجلات تحليلية خارج الحدود الوطنية، مع اشتراط عزل معالجة البيانات داخل مراكز سيادية مغلقة وتفعيل التشفير الشامل من النواة إلى المتصفح.',
    technicalDetailsEn: 'Mandates that any security appliance operate under sovereign deterministic isolation: no cryptographic keys or analytical telemetry may leave sovereign territory, enforcing end-to-end zero-trust confinement.',
    standardReference: 'DGSSI National Directive 07-03 / ISO 27001 A.18',
    terminalExercise: {
      command: 'cat /etc/issue && uname -r && ls -la /sys/kernel/security',
      expectedOutput: 'Linux Sovereign-Mesh 6.8.0-sovereign-taha-setrii #1 SMP PREEMPT_DYNAMIC\nSecurityFS: lsm=apparmor,ebpf,integrity active',
      explanationAr: 'التحقق من طبقة أمان النواة المفعلة والتأكد من خلو النظام من أي خلفيات غير مدققة.',
      explanationEn: 'Verifies the kernel LSM security filesystem and active hardware hardening modules.'
    },
    sovereignImpactAr: 'تأصيل الحصانة الوطنية وضمان استقلالية القرارات الحيوية للبلاد والبنوك والمؤسسات.',
    sovereignImpactEn: 'Guarantees national autonomy and cryptographic immunity for critical infrastructure.'
  },
  25: {
    pageNumber: 25,
    volumeId: 1,
    ruleCode: 'RULE-025-TCP-HANDSHAKE',
    titleAr: 'القاعدة 025: هندسة مصافحة TCP الثلاثية ومنع هجمات الإغراق (SYN Flood)',
    titleEn: 'Rule 025: TCP 3-Way Handshake & Wire-Speed SYN Cookies',
    category: 'بروتوكولات الشبكة والنواة',
    threatLevel: 'HIGH',
    ruleQuoteAr: '«أي اتصال يبدأ بحزمة لم تُطلب، هو مشروع تهديد حتى يثبت العكس عبر تدقيق رياضي في زمن لا يتعدى بيكوثانية.»',
    ruleQuoteEn: '“Any connection initiating with an unsolicited packet is a latent threat until proven benign through wire-speed verification.”',
    technicalDetailsAr: 'في هجمات SYN Flood، يرسل المهاجم ملايين حزم SYN دون إكمال مصافحة ACK، مما يستنزف جدول اتصالات النواة (backlog queue). القاعدة تفرض تفعيل SYN Cookies مشفرة تشفير تجزئة سرية لتوليد أرقام التتابع الأولية (ISN) دون حجز أي ذاكرة في النواة.',
    technicalDetailsEn: 'Defeats connection state exhaustion by encoding cryptographic SYN cookies into sequence numbers, retaining zero memory backlog until complete handshake.',
    standardReference: 'RFC 4987 / NIST SP 800-44',
    terminalExercise: {
      command: 'sysctl -w net.ipv4.tcp_syncookies=1 net.ipv4.tcp_max_syn_backlog=4096',
      expectedOutput: 'net.ipv4.tcp_syncookies = 1\nnet.ipv4.tcp_max_syn_backlog = 4096\n[IMMUNITY]: SYN Flood Mitigation Engine Armed.',
      explanationAr: 'تفعيل ملفات تعريف الارتباط التزامنية في النواة وتوسيع طابور الاستقبال لمنع الشلل أثناء الهجمات المليونية.',
      explanationEn: 'Enables kernel TCP SYN cookies and enlarges listen socket queues to survive massive floods.'
    },
    sovereignImpactAr: 'حماية خوادم الدفع الإلكتروني ومواقع السيادة الحكومية من التوقف القسري.',
    sovereignImpactEn: 'Prevents denial of service across sovereign payment processors and national gateways.'
  },
  451: {
    pageNumber: 451,
    volumeId: 2,
    ruleCode: 'RULE-151-SILENT-RECON',
    titleAr: 'القاعدة 151: استطلاع الأهداف الصامت وقوانين عدم الاشتباك',
    titleEn: 'Rule 151: Passive Reconnaissance & Strict Engagement Boundaries',
    category: 'الاستخبارات السيبرانية والأطر القانونية',
    threatLevel: 'MEDIUM',
    ruleQuoteAr: '«الهاكر الأخلاقي الحقيقي يرى كل شيء دون أن يترك أثراً، ولا يمس نظاماً دون وثيقة تفويض قانونية موقعة بالدم.»',
    ruleQuoteEn: '“The true ethical defender observes without leaving footprint, never touching infrastructure without notarized written authorization.”',
    technicalDetailsAr: 'الاستطلاع السلبي يعتمد كلياً على البيانات المتاحة للعموم دون إرسال حزمة واحدة مباشرة للهدف: تحليل سجلات Certificate Transparency، استعلامات DNS الموزعة، وبيانات BGP Routing. هذا يحمي الفريق الأخلاقي من الوقوع تحت طائلة القانون الجنائي.',
    technicalDetailsEn: 'Passive reconnaissance gathers intelligence purely via external third-party caches (CT logs, passive DNS, BGP tables) with zero packets transmitted directly.',
    standardReference: 'Moroccan Penal Code Law 07-03 / OSSTMM 3.0',
    terminalExercise: {
      command: 'curl -s "https://crt.sh/?q=%.domain.ma&output=json" | jq -r ".[].name_value" | sort -u | head -n 10',
      expectedOutput: 'api.domain.ma\nauth.domain.ma\nbanking.domain.ma\nportal.domain.ma\nvpn.domain.ma',
      explanationAr: 'استخراج النطاقات الفرعية من سجلات شهادات TLS العامة دون توجيه فحص للمنظومة.',
      explanationEn: 'Extracts target subdomains from public certificate transparency logs without active scanning.'
    },
    sovereignImpactAr: 'التزام تام بالقوانين المغربية والدولية وبناء خريطة أمان شاملة للأصول الوطنية.',
    sovereignImpactEn: 'Total alignment with national cyber laws while mapping the national digital attack surface.'
  },
  981: {
    pageNumber: 981,
    volumeId: 3,
    ruleCode: 'RULE-321-SQLI-DESTRUCTION',
    titleAr: 'القاعدة 321: الاستئصال الجذري لثغرات حقن قواعد البيانات (SQL Injection)',
    titleEn: 'Rule 321: Absolute Eradication of SQL Injection via Prepared Statements',
    category: 'أمن تطبيقات الويب وقواعد البيانات',
    threatLevel: 'CRITICAL',
    ruleQuoteAr: '«دمج مدخلات المستخدم مباشرة داخل نص الاستعلام هو انتحار برمجي. لا تثق في أي بايت يدخل نظامك.»',
    ruleQuoteEn: '“Concatenating raw user input into executable queries is architectural suicide. Treat all inputs as hostile payloads.”',
    technicalDetailsAr: 'ثغرة SQLi تسمح بتجاوز المصادقة وسرقة قواعد البيانات أو تنفيذ أوامر النظام عبر مسار xp_cmdshell. العلاج القاطع الوحيد هو فصل كود الاستعلام المترجم مسبقاً (Pre-compiled AST) عن المتغيرات باستخدام Parameterized Queries، مع حظر تجميع السلاسل تماماً.',
    technicalDetailsEn: 'Eliminates SQL injection by compiling the query syntax tree beforehand, strictly binding user parameters as unexecutable string literals.',
    standardReference: 'OWASP A03:2021-Injection / NIST SP 800-95',
    terminalExercise: {
      command: 'psql -U postgres -d sovereign_db -c "PREPARE user_auth (text, text) AS SELECT id, role FROM users WHERE email = $1 AND pass_hash = crypt($2, pass_hash);"',
      expectedOutput: 'PREPARE\n[SECURE]: Query prepared with parameter isolation. Concatenation attacks permanently blocked.',
      explanationAr: 'إنشاء استعلام مجهز ومعلم مسبقاً يفصل الأوامر البرمجية عن مدخلات المستخدم العشوائية.',
      explanationEn: 'Creates a parameterized prepared statement, mathematically preventing SQL syntax injection.'
    },
    sovereignImpactAr: 'حماية سجلات المواطنين الحساسة، أرصدة الحسابات البنكية، ومعطيات الصناديق السيادية.',
    sovereignImpactEn: 'Prevents catastrophic leaks across citizen databases, financial institutions, and sovereign funds.'
  },
  1521: {
    pageNumber: 1521,
    volumeId: 4,
    ruleCode: 'RULE-541-CONTAINER-IMMUNITY',
    titleAr: 'القاعدة 541: عزل الحاويات ونظام التشغيل المصغر (Zero-Privilege Containers)',
    titleEn: 'Rule 541: Zero-Privilege Containerization & Linux Namespace Isolation',
    category: 'أمن السحابة والحاويات والـ DevOps',
    threatLevel: 'HIGH',
    ruleQuoteAr: '«الحاوية ليست جداراً فاصلاً إذا كانت تمتلك صلاحية root على النواة. احبس كل خدمة في سجن cgroups بلا هوادة.»',
    ruleQuoteEn: '“A container is no boundary if running as root on the shared kernel. Confine every process inside immutable namespaces.”',
    technicalDetailsAr: 'تمنع هذه القاعدة تشغيل أي حاوية بامتيازات privileged أو تحت مستخدم root. تفرض إسقاط جميع قدرات لينكس (Drop ALL Capabilities)، وتفعيل نظام ملفات للقراءة فقط (read-only rootfs)، واستخدام ملفات seccomp لحظر مكالمات النواة الخطرة.',
    technicalDetailsEn: 'Enforces rootless containers, drop-all Linux capabilities, immutable read-only filesystems, and strict seccomp system-call filter profiles.',
    standardReference: 'CIS Docker Benchmark 1.6 / NIST SP 800-190',
    terminalExercise: {
      command: 'docker run --rm --read-only --cap-drop=ALL --security-opt=no-new-privileges:true --user 10001:10001 alpine:latest whoami',
      expectedOutput: 'uid=10001(nonroot) gid=10001(nonroot)\n[CONTAINER]: All kernel capabilities dropped. Escape vectors neutralized.',
      explanationAr: 'تشغيل حاوية آمنة مع تجريد كامل للصلاحيات ونظام ملفات غير قابل للكتابة لمنع تثبيت البرمجيات الخبيثة.',
      explanationEn: 'Launches a hardened container with all capabilities revoked, neutralizing privilege breakout attacks.'
    },
    sovereignImpactAr: 'منع اختراق البنى التحتية السحابية الوطنية حتى لو تم استغلال ثغرة في تطبيق ويب.',
    sovereignImpactEn: 'Prevents cluster takeover and host escape even if a web application vulnerability is breached.'
  },
  2051: {
    pageNumber: 2051,
    volumeId: 5,
    ruleCode: 'RULE-711-EBPF-XDP-INTERCEPT',
    titleAr: 'القاعدة 711: الاعتراض السلكي للنواة عبر eBPF/XDP وتصفية التهديدات في كابل الشبكة',
    titleEn: 'Rule 711: Wire-Speed eBPF/XDP Interception & Sub-Millisecond Kernel Dropping',
    category: 'الدفاع الذاتي السيادي وهندسة النواة',
    threatLevel: 'CRITICAL',
    ruleQuoteAr: '«لا تدع الحزمة الخبيثة تستهلك دورة معالج واحدة أو تصل لمكدس الشبكة. اسحقها على كارت الشبكة في اللحظة الأولى.» — طه الستري',
    ruleQuoteEn: '“Never allow a hostile packet to waste a single CPU cycle or reach the network stack. Neutralize it on the NIC driver layer at wire speed.” — TAHA SETRII',
    technicalDetailsAr: 'تقنية eBPF المقترنة بـ eXpress Data Path (XDP) تُنفذ كود C مجمع مسبقاً داخل برنامج تعريف بطاقة الشبكة (NIC Driver) قبل تخصيص بنية sk_buff في ذاكرة النواة. هذا يحقق معدل تصفية يتجاوز 40 مليون حزمة في الثانية لكل نواة معالج.',
    technicalDetailsEn: 'XDP runs verified eBPF bytecode in the NIC driver ring buffer before socket allocation, dropping multi-gigabit volumetric attacks at 40M+ packets per second.',
    standardReference: 'Linux Kernel Documentation BPF / NIST SP 800-125B',
    terminalExercise: {
      command: 'bpftool prog load xdp_sovereign_filter.o /sys/fs/bpf/xdp_filter && ip link set dev eth0 xdp pinned /sys/fs/bpf/xdp_filter',
      expectedOutput: '[eBPF/XDP]: Hooked to eth0 (driver mode).\n[BENCHMARK]: 38,450,000 pkts/sec processing capability armed.\n[STATUS]: Sovereign Wire-Speed Defense ACTIVE.',
      explanationAr: 'تحميل كود دفاعي داخل النواة وربطه ببطاقة الشبكة مباشرة لإسقاط الهجمات قبل استهلاك موارد الخادم.',
      explanationEn: 'Loads verified eBPF bytecode directly into the network interface driver for sub-millisecond filtering.'
    },
    sovereignImpactAr: 'صمود البنوك، منظومة الكهرباء، ومراكز البيانات الوطنية ضد أعتى هجمات الفدية وحجب الخدمة العالمية.',
    sovereignImpactEn: 'Absolute resilience of power grids, banking backbones, and sovereign datacenters against state-sponsored attacks.'
  },
  2200: {
    pageNumber: 2200,
    volumeId: 5,
    ruleCode: 'RULE-760-POST-QUANTUM',
    titleAr: 'القاعدة 760: مناعة ما بعد الكم (PQC) واعتماد معايير NIST FIPS 203 (ML-KEM-1024)',
    titleEn: 'Rule 760: Post-Quantum Cryptography & NIST FIPS 203 Lattice Security',
    category: 'التشفير السيادي المقاوم للحواسيب الكمومية',
    threatLevel: 'CRITICAL',
    ruleQuoteAr: '«البيانات التي تُسرق اليوم لتُفكك غداً بحواسيب الكم هي خطر استراتيجي داهم. التشفير الشبكي ليس للمستقبل، بل لليوم.»',
    ruleQuoteEn: '“Encrypted data harvested today to be decrypted tomorrow by quantum computers is an existential risk. Lattice cryptography is mandatory today.”',
    technicalDetailsAr: 'تفرض هذه القاعدة استبدال خوارزميات RSA و Diffie-Hellman و ECC بخوارزمية تبادل المفاتيح الشبكية ML-KEM-1024 وخوارزمية التوقيع الرقمي ML-DSA-87، مما يجعل حركة البيانات محصنة ضد خوارزمية شور الكمومية.',
    technicalDetailsEn: 'Replaces vulnerable RSA/ECC with lattice-based NIST FIPS 203 (ML-KEM) and FIPS 204 (ML-DSA) to neutralize harvest-now-decrypt-later quantum attacks.',
    standardReference: 'NIST FIPS 203 / FIPS 204 (August 2024 Standards)',
    terminalExercise: {
      command: 'openssl kdf -keylen 32 -kdfopt pass:sovereign_lattice_entropy -kdfopt salt:morocco_national_seed HKDF',
      expectedOutput: 'e8:a4:21:f9:83:0b:61:52:9a:77:4d:1c:ee:34:bb:91:0a:fe:32:89:14:66:bc:88:51:29:f3:10:aa:98:40:71\n[POST-QUANTUM]: 256-bit Post-Quantum Derived Key Seed Ready.',
      explanationAr: 'توليد مفاتيح تشفير كمومية شبكية مشتقة من بذور إنتروبيا عشوائية غير قابلة للكسر خوارزمياً.',
      explanationEn: 'Derives cryptographic key material resistant to Shor and Grover quantum algorithmic attacks.'
    },
    sovereignImpactAr: 'حماية أسرار الدولة، الوثائق العسكرية، وسجلات المواطنين من مخاطر فك التشفير المستقبلي.',
    sovereignImpactEn: 'Protects critical state secrets, intellectual property, and defense infrastructure from quantum decryption.'
  },
  2681: {
    pageNumber: 2681,
    volumeId: 6,
    ruleCode: 'RULE-881-15MIN-INCIDENT-RESPONSE',
    titleAr: 'القاعدة 881: قاعدة الـ 15 دقيقة لاحتواء الاختراق والتحقيق الجنائي الرقمي (DFIR)',
    titleEn: 'Rule 881: The 15-Minute Containment Protocol & Forensics Triage',
    category: 'الاستجابة للحوادث والتحقيق الجنائي الرقمي',
    threatLevel: 'HIGH',
    ruleQuoteAr: '«سرعة الاستجابة في الربع ساعة الأولى تحدد ما إذا كان الحادث مجرد محاولة محبطة، أو كارثة وطنية تتصدر نشرات الأخبار.»',
    ruleQuoteEn: '“The speed of response in the initial fifteen minutes dictates whether an intrusion is an isolated incident or an enterprise disaster.”',
    technicalDetailsAr: 'تفرض القاعدة بروتوكول عزل فوري للجهاز المخترق مع الإبقاء على الطاقة الكهربائية للحفاظ على الذاكرة الحية (RAM Volatility). يمنع إعادة تشغيل الخادم، ويتم التقاط صورة كاملة للذاكرة عبر LiME وعزل مقطع الشبكة فوراً.',
    technicalDetailsEn: 'Mandates instant automated endpoint isolation while preserving volatile RAM state. Prohibits rebooting, initiates immediate memory dumps via LiME, and locks down egress conduits.',
    standardReference: 'NIST SP 800-61 Rev. 2 / SANS Incident Handler Guide',
    terminalExercise: {
      command: 'sudo lime-dump --output /mnt/forensics/evidence_mem.raw --format raw && iptables -I INPUT -j DROP && iptables -I OUTPUT -j DROP',
      expectedOutput: '[DFIR]: Physical memory dumped (16,384 MB written, SHA256 verified).\n[ISOLATION]: Host network traffic severed. Forensics preservation sealed.',
      explanationAr: 'أخذ نسخة جنائية من الذاكرة الحية وعزل الجهاز فوراً دون مسح آثار المهاجم في ذاكرة RAM.',
      explanationEn: 'Captures a forensically sound raw memory image and severs network communication to prevent data exfiltration.'
    },
    sovereignImpactAr: 'حفظ الأدلة القانونية لتقديم المهاجمين للقضاء وحماية بقية الشبكة من التمدد الجانبي (Lateral Movement).',
    sovereignImpactEn: 'Secures legal evidence admissibility while eliminating lateral movement across sovereign networks.'
  },
  3250: {
    pageNumber: 3250,
    volumeId: 6,
    ruleCode: 'RULE-999-SOVEREIGN-SEAL',
    titleAr: 'القاعدة 999: ميثاق الشرف والسيادة السيبرانية التامة (The Sovereign Cyber Oath)',
    titleEn: 'Rule 999: The Sovereign Cyber Oath & Immutable Defense Protocol',
    category: 'الميثاق السيادي وختام الموسوعة',
    threatLevel: 'CRITICAL',
    ruleQuoteAr: '«العلم قوة، وقوة السيبراني إما أن تحرس وطناً وترفع رايته، أو تسقط في مستنقع الخراب. نحن اخترنا أن نكون حماة النور والسيادة.» — طه الستري',
    ruleQuoteEn: '“Knowledge is power; sovereign cybersecurity either elevates a nation or descends into chaos. We have chosen to be the vigilant guardians of sovereignty.” — TAHA SETRII',
    technicalDetailsAr: 'الصفحة الختامية للموسوعة الكبرى (3,250 صفحة). تعلن استكمال المنهج الشامل من الصفر إلى أعلى مراتب القيادة السيبرانية، وتثبت خوارزميات التوقيع الرقمي للمنظومة، مع التزام مهندسي طه الستري بحماية الأمن القومي المغربي.',
    technicalDetailsEn: 'The concluding page of the 3,250-page magnum opus. Establishes the sovereign digital pledge, cryptographic verification seals, and lifetime commitment to critical infrastructure protection.',
    standardReference: 'Sovereign Charter of Ethical Cyber Defense / DGSSI 2030 Roadmap',
    terminalExercise: {
      command: 'sha256sum /etc/taha-setrii-sovereign-codex.manifest',
      expectedOutput: 'd8f4e21a8b993c40156ef65421a998c56e719280a911fbcda217a941bce89201  [VERIFIED - 3,250 PAGES SEALED BY TAHA SETRII]',
      explanationAr: 'التحقق الرياضي من بصمة التشفير الشاملة للموسوعة لضمان أصالتها ومناعتها ضد أي تلاعب.',
      explanationEn: 'Mathematically verifies the complete 3,250-page codex cryptographic integrity hash.'
    },
    sovereignImpactAr: 'تتويج المسيرة الوطنية وتخريج كوادر قادرة على قيادة الأمن السيبراني في المغرب وإفريقيا والعالم.',
    sovereignImpactEn: 'Concludes the 3,250-page curriculum, validating elite sovereign cyber operators ready for national defense.'
  }
};
