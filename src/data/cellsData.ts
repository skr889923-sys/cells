export interface Organelle {
  id: string;
  name: string;
  function: string;
  medicalImportance: string;
  color: string;
  position?: [number, number, number]; // Hotspot location on the 3D model
  cameraTarget?: [number, number, number]; // Where the camera should look
  cameraPosition?: [number, number, number]; // Where the camera should move to
  imageUrl?: string; // Image for the info card
}

export interface DiagnosticCase {
  id: string;
  scenario: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface MicroscopeView {
  id: string;
  type: string;
  imageUrl: string;
  caption: string;
}

export interface CellData {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  modelUrl?: string;
  initialRotation?: [number, number, number]; // [x, y, z] to orient the model
  cameraPosition?: [number, number, number]; // Default overall camera position
  cameraTarget?: [number, number, number]; // Default overall camera target
  organelles: Organelle[];
  microscopeViews: MicroscopeView[];
}

const localAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export const cellsData: CellData[] = [
  {
    id: 'neuron-cell',
    title: 'خلية عصبية (عصبون)',
    category: 'خلية عصبية',
    description: 'الخلايا العصبية هي الوحدات الأساسية للدماغ والجهاز العصبي. تنقل النبضات الكهربائية السريعة إلى الخلايا الأخرى.',
    imageUrl: localAsset('cells/neuron_cell_1779685899586.png'),
    modelUrl: localAsset('3D/neuron+model+3d.glb'),
    cameraPosition: [-1.023, 0.13, -0.265],
    cameraTarget: [0.03, -0.012, 0.015],
    organelles: [
      { 
        id: 'soma', 
        name: 'جسم الخلية (Soma)', 
        function: 'يحتوي على النواة والعضيات الأساسية، وهو المسؤول عن الحفاظ على حياة الخلية وتصنيع البروتينات.', 
        medicalImportance: 'تلفه يؤدي إلى موت الخلية العصبية بشكل دائم، مما يسبب أمراضاً تنكسية مثل الزهايمر.', 
        color: '#b19cd9',
        position: [-0.049, 0.354, 0.1],
        cameraTarget: [0.013, -0.013, 0.004],
        cameraPosition: [0.503, 0.057, 0.19],
        imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80'
      },
      { 
        id: 'nucleus', 
        name: 'النواة (Nucleus)', 
        function: 'مركز التحكم وتخزين الحمض النووي (DNA)، تنظم التعبير الجيني لبناء النواقل العصبية.', 
        medicalImportance: 'أي طفرة جينية هنا قد تؤدي إلى اضطرابات عصبية وراثية.', 
        color: '#9775fa',
        position: [0.063, 0.352, 0.234],
        cameraTarget: [0, -0.007, -0.004],
        cameraPosition: [-0.521, 0.289, -0.378],
        imageUrl: 'https://images.unsplash.com/photo-1614935151651-0bea6508abb0?auto=format&fit=crop&q=80'
      },
      { 
        id: 'dendrites', 
        name: 'الزوائد الشجرية (Dendrites)', 
        function: 'تستقبل الإشارات الكيميائية والكهربائية من الخلايا العصبية الأخرى وتنقلها إلى جسم الخلية.', 
        medicalImportance: 'تضررها يضعف التواصل العصبي ويؤثر على التعلم والذاكرة.', 
        color: '#74c0fc',
        position: [-0.007, 0.581, 0.426],
        cameraTarget: [0.023, -0.01, 0.005],
        cameraPosition: [0.106, 0.31, -0.628],
        imageUrl: 'https://images.unsplash.com/photo-1520106292534-75466c406140?auto=format&fit=crop&q=80'
      },
      { 
        id: 'axon', 
        name: 'المحور العصبي (Axon)', 
        function: 'أنبوب طويل ينقل النبضات الكهربائية (جهد الفعل) بعيداً عن جسم الخلية نحو الأطراف.', 
        medicalImportance: 'إصابات الحبل الشوكي غالباً ما تتضمن قطعاً في هذه المحاور.', 
        color: '#ffd43b',
        position: [0.038, 0.356, -0.044],
        cameraTarget: [-0.001, -0.007, -0.002],
        cameraPosition: [-0.239, 0.191, 0.016],
        imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80'
      },
      { 
        id: 'myelin-sheath', 
        name: 'الغمد المياليني (Myelin Sheath)', 
        function: 'طبقة دهنية عازلة تغلف المحور العصبي لتسريع انتقال النبضات الكهربائية.', 
        medicalImportance: 'تدمير هذه الطبقة يسبب التصلب المتعدد (MS) مما يبطئ استجابة الجسم.', 
        color: '#fcc419',
        position: [0.036, 0.339, -0.181],
        cameraTarget: [0.013, -0.013, 0.004],
        cameraPosition: [-0.091, 0.006, 0.285],
        imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d3655e?auto=format&fit=crop&q=80'
      },
      { 
        id: 'axon-terminal', 
        name: 'النهايات العصبية (Axon Terminals)', 
        function: 'تفرز النواقل الكيميائية (Neurotransmitters) في الشق التشابكي لنقل الإشارة للخلية التالية.', 
        medicalImportance: 'موقع عمل الكثير من الأدوية النفسية والمخدرات (مثل مثبطات استرداد السيروتونين).', 
        color: '#ff8787',
        position: [-0.065, 0.358, -0.484],
        cameraTarget: [0.03, -0.012, 0.015],
        cameraPosition: [-0.006, 0.115, 0.767],
        imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80'
      }
    ],
    microscopeViews: [{ id: 'n1', type: 'مجهر فلورسنت', imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80', caption: 'شبكة خلايا عصبية مضيئة.' }]
  },
  {
    id: 'animal-cell',
    title: 'خلية حيوانية',
    category: 'خلية حقيقية النواة',
    description: 'الخلية الحيوانية هي الوحدة الأساسية لأجسام الحيوانات والإنسان. تفتقر للجدار الخلوي الخارجي مما يمنحها مرونة عالية، وتحتوي على عضيات متعددة متخصصة.',
    imageUrl: localAsset('cells/animal_cell_1779685912436.png'),
    modelUrl: localAsset('3D/cell+model+3d (2).glb'),
    initialRotation: [0, Math.PI, 0],
    cameraPosition: [-1.235, 0.735, 0.39],
    cameraTarget: [-0.006, -0.008, -0.008],
    organelles: [
      { 
        id: 'nucleus', 
        name: 'النواة (Nucleus)', 
        function: 'مركز التحكم الأساسي في الخلية، تحتوي على الحمض النووي (DNA) الذي يحمل التعليمات الوراثية.', 
        medicalImportance: 'التشوهات في النواة أو الـ DNA تسبب أمراضاً وراثية وتلعب دوراً رئيسياً في تطور السرطان.', 
        color: '#9775fa',
        position: [0.043, 0.585, -0.03],
        cameraPosition: [-0.468, 0.436, 0.137],
        cameraTarget: [-0.003, -0.002, -0.009],
        imageUrl: 'https://images.unsplash.com/photo-1614935151651-0bea6508abb0?auto=format&fit=crop&q=80'
      },
      { 
        id: 'mitochondria', 
        name: 'الميتوكوندريا (Mitochondria)', 
        function: 'مصانع الطاقة في الخلية، حيث يتم إنتاج الـ ATP عبر عملية التنفس الخلوي.', 
        medicalImportance: 'أمراض الميتوكوندريا الوراثية تؤثر بشدة على الأعضاء التي تستهلك طاقة عالية كالدماغ والعضلات.', 
        color: '#ff922b',
        position: [0.179, 0.476, -0.366],
        cameraPosition: [-0.422, 0.147, 0.659],
        cameraTarget: [-0.003, -0.003, -0.009],
        imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80'
      },
      { 
        id: 'cell-membrane', 
        name: 'غشاء الخلية (Cell Membrane)', 
        function: 'غشاء بلازمي مرن وشبه منفذ ينظم دخول وخروج المواد من وإلى الخلية.', 
        medicalImportance: 'يحتوي على مستقبلات للأدوية والهرمونات (مثل الأنسولين). خلل هذه المستقبلات يؤدي لأمراض كالسكري.', 
        color: '#ff6b6b',
        position: [-0.164, 0.292, -0.414],
        cameraPosition: [-0.413, 0.647, 2.512],
        cameraTarget: [-0.003, -0.003, -0.009],
        imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80'
      },
      { 
        id: 'golgi-apparatus', 
        name: 'جهاز جولجي (Golgi Apparatus)', 
        function: 'يقوم بتعديل، تعبئة، وتغليف البروتينات والدهون تمهيداً لإرسالها لوجهاتها النهائية.', 
        medicalImportance: 'مرتبط بأمراض التنكس العصبي مثل مرض باركنسون وزهايمر عند تراكم البروتينات غير المعدلة بشكل صحيح.', 
        color: '#20c997',
        position: [0.262, 0.489, 0.255],
        cameraPosition: [-0.574, 0.204, -0.443],
        cameraTarget: [-0.002, -0.003, -0.009],
        imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80'
      },
      { 
        id: 'endoplasmic-reticulum', 
        name: 'الشبكة الإندوبلازمية (Endoplasmic Reticulum)', 
        function: 'شبكة من الأغشية تُعنى بتصنيع البروتينات (الخشنة) والدهون وإزالة السموم (الملساء).', 
        medicalImportance: 'إجهاد الشبكة الإندوبلازمية يُساهم في تطور أمراض الكبد وأمراض القلب والسمنة.', 
        color: '#4dabf7',
        position: [0.224, 0.503, -0.153],
        cameraPosition: [-0.419, 0.14, 0.221],
        cameraTarget: [-0.006, -0.011, -0.007],
        imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80'
      }
    ],
    microscopeViews: [{ id: 'a1', type: 'المجهر الإلكتروني', imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d3655e?auto=format&fit=crop&q=80', caption: 'تفاصيل دقيقة لخلية حيوانية.' }]
  },
  {
    id: 'plant-cell',
    title: 'خلية نباتية',
    category: 'خلية حقيقية النواة',
    description: 'الخلايا النباتية تتميز بجدار خلوي صلب وبلاستيدات خضراء تقوم بالبناء الضوئي، وفجوة عصارية مركزية كبيرة.',
    imageUrl: localAsset('cells/plant_cell_1779685924937.png'),
    modelUrl: localAsset('3D/cell+model+3d_Clone1.glb'),
    cameraPosition: [0.054, 1.042, -0.784],
    cameraTarget: [0.001, -0.007, 0.008],
    organelles: [
      { 
        id: 'cell-wall', 
        name: 'الجدار الخلوي (Cell Wall)', 
        function: 'هيكل صلب يحيط بالخلية يوفر الدعم الهيكلي والحماية ويحدد شكل الخلية.', 
        medicalImportance: 'يحتوي على السليلوز المفيد كألياف غذائية للإنسان، وهو هدف لبعض المضادات الحيوية (في البكتيريا المشابهة).', 
        color: '#40c057',
        position: [-0.031, 0.236, 0.395],
        cameraTarget: [0.001, -0.006, 0.008],
        cameraPosition: [0.282, 0.696, -1.291],
        imageUrl: 'https://images.unsplash.com/photo-1629904853716-f0bc54aea4af?auto=format&fit=crop&q=80'
      },
      { 
        id: 'chloroplast', 
        name: 'البلاستيدات الخضراء (Chloroplast)', 
        function: 'تحتوي على الكلوروفيل وتقوم بعملية البناء الضوئي لتحويل الطاقة الشمسية إلى سكريات.', 
        medicalImportance: 'مصدر الأكسجين الأساسي على كوكب الأرض والأساس الغذائي للسلاسل الغذائية.', 
        color: '#2b8a3e',
        position: [-0.24, 0.292, 0.196],
        cameraTarget: [0.001, -0.007, 0.008],
        cameraPosition: [0.649, 0.343, -0.429],
        imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80'
      },
      { 
        id: 'large-vacuole', 
        name: 'الفجوة العصارية المركزية (Large Vacuole)', 
        function: 'تخزن الماء والفضلات والمواد الغذائية، وتوفر ضغط الامتلاء (Turgor Pressure) لدعم النبات.', 
        medicalImportance: 'تحتوي أحياناً على مركبات طبية أو سموم دفاعية تستخدم في صناعة الأدوية.', 
        color: '#3bc9db',
        position: [-0.009, 0.444, 0.154],
        cameraTarget: [0.001, -0.007, 0.008],
        cameraPosition: [0.042, 0.807, -0.606],
        imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80'
      },
      { 
        id: 'nucleus', 
        name: 'النواة (Nucleus)', 
        function: 'تحمل المادة الوراثية (DNA) وتنظم جميع أنشطة الخلية النباتية ونموها.', 
        medicalImportance: 'التلاعب الجيني بها يسمح بإنتاج محاصيل معدلة وراثياً (GMO) مقاومة للأمراض والجفاف.', 
        color: '#9775fa',
        position: [-0.085, 0.402, -0.14],
        cameraTarget: [0.001, -0.006, 0.008],
        cameraPosition: [0.096, 0.591, 0.336],
        imageUrl: 'https://images.unsplash.com/photo-1614935151651-0bea6508abb0?auto=format&fit=crop&q=80'
      },
      { 
        id: 'mitochondria', 
        name: 'الميتوكوندريا (Mitochondria)', 
        function: 'تقوم بالتنفس الخلوي لتحطيم السكريات الناتجة عن البناء الضوئي وإنتاج طاقة (ATP) قابلة للاستخدام.', 
        medicalImportance: 'تعمل كنموذج لدراسة أمراض الشيخوخة واستقلاب الطاقة المماثلة في الإنسان.', 
        color: '#ff922b',
        position: [-0.188, 0.297, -0.264],
        cameraTarget: [0.001, -0.006, 0.008],
        cameraPosition: [0.424, 0.249, 0.451],
        imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80'
      }
    ],
    microscopeViews: [{ id: 'p1', type: 'المجهر الضوئي', imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f4956ce84?auto=format&fit=crop&q=80', caption: 'خلايا نبات البصل تظهر الجدار الخلوي.' }]
  },
  {
    id: 'bacterial-cell',
    title: 'خلية بكتيرية',
    category: 'بدائية النواة',
    description: 'كائنات وحيدة الخلية بدائية النواة. لا تمتلك نواة حقيقية محاطة بغشاء، وتتميز بوجود كبسولة خارجية وسوط للحركة.',
    imageUrl: localAsset('cells/bacterial_cell_1779685934742.png'),
    modelUrl: localAsset('3D/bacterium+3d+model (2).glb'),
    cameraPosition: [-1.044, -0.017, -0.785],
    cameraTarget: [-0.007, -0.004, 0.129],
    organelles: [
      { 
        id: 'nucleoid', 
        name: 'المنطقة النووية (Nucleoid)', 
        function: 'منطقة غير محاطة بغشاء تحتوي على حلقة مفردة مكثفة من الحمض النووي (DNA) المفتقر للهستونات.', 
        medicalImportance: 'موقع استهداف العديد من المضادات الحيوية (مثل الكينولونات) لمنع تكاثر البكتيريا الممرضة.', 
        color: '#845ef7',
        position: [0.096, 0.308, 0.086],
        cameraTarget: [0.013, -0.004, 0.082],
        cameraPosition: [-0.58, -0.036, -0.242],
        imageUrl: 'https://images.unsplash.com/photo-1614935151651-0bea6508abb0?auto=format&fit=crop&q=80'
      },
      { 
        id: 'flagellum', 
        name: 'السوط (Flagellum)', 
        function: 'محرك ميكروسكوبي دوّار يساعد الخلية البكتيرية على السباحة والتوجه نحو الغذاء.', 
        medicalImportance: 'يساعد البكتيريا المسببة للأمراض (مثل الكوليرا) على اختراق الأغشية المخاطية في الإنسان.', 
        color: '#ffc078',
        position: [0.006, 0.334, -0.481],
        cameraTarget: [0.013, -0.004, 0.082],
        cameraPosition: [-0.201, -0.039, 0.8],
        imageUrl: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80'
      },
      { 
        id: 'capsule', 
        name: 'الكبسولة (Capsule)', 
        function: 'طبقة هلامية خارجية سميكة تحمي البكتيريا من الجفاف وتساعدها على الالتصاق بالأسطح.', 
        medicalImportance: 'تزيد من خطورة البكتيريا (Virulence) لأنها تمنع خلايا الدم البيضاء من ابتلاعها.', 
        color: '#fcc419',
        position: [0.121, 0.245, 0.016],
        cameraTarget: [0.013, -0.004, 0.083],
        cameraPosition: [-0.337, -0.15, -0.112],
        imageUrl: 'https://images.unsplash.com/photo-1629904853716-f0bc54aea4af?auto=format&fit=crop&q=80'
      },
      { 
        id: 'plasmids', 
        name: 'البلازميدات (Plasmids)', 
        function: 'حلقات DNA صغيرة إضافية تحمل جينات غير أساسية ولكنها مفيدة، ويمكن انتقالها بين البكتيريا.', 
        medicalImportance: 'السبب الرئيسي في انتشار ظاهرة "مقاومة المضادات الحيوية" بين السلالات البكتيرية.', 
        color: '#20c997',
        position: [0.08, 0.228, 0.275],
        cameraTarget: [0.013, -0.004, 0.082],
        cameraPosition: [-0.264, -0.089, -0.421],
        imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80'
      },
      { 
        id: 'ribosomes', 
        name: 'الريبوسومات (Ribosomes 70S)', 
        function: 'مصانع صغيرة تسبح في السيتوبلازم لترجمة الـ RNA وبناء البروتينات.', 
        medicalImportance: 'لأن ريبوسومات البكتيريا (70S) تختلف عن الإنسان (80S)، يتم استهدافها بمضادات مثل التتراسيكلين بأمان.', 
        color: '#ff8787',
        position: [0.085, 0.371, -0.134],
        cameraTarget: [0.013, -0.004, 0.082],
        cameraPosition: [-0.348, 0.113, 0.143],
        imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80'
      }
    ],
    microscopeViews: [{ id: 'b1', type: 'المجهر الإلكتروني', imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80', caption: 'بكتيريا تحت المجهر الإلكتروني.' }]
  },
  {
    id: 'red-blood-cell',
    title: 'كرية الدم الحمراء',
    category: 'خلايا الدم',
    description: 'خلايا متخصصة جداً في نقل الأكسجين. تفتقر في مرحلة نضجها إلى النواة ومعظم العضيات لتوفير مساحة كافية لبروتين الهيموجلوبين.',
    imageUrl: localAsset('cells/red_blood_cell_1779685947823.png'),
    modelUrl: localAsset('3D/red+liquid+ring+3d+model.glb'),
    cameraPosition: [-0.555, 1.494, -1.83],
    cameraTarget: [-0.003, 0, 0.005],
    organelles: [
      { 
        id: 'biconcave-shape', 
        name: 'الشكل المقعر الوجهين (Biconcave Shape)', 
        function: 'تصميم هندسي فريد يزيد من مساحة السطح نسبةً إلى الحجم، مما يسهل ويسرع تبادل الغازات (الأكسجين وثاني أكسيد الكربون).', 
        medicalImportance: 'في فقر الدم المنجلي (Sickle Cell Anemia)، يتشوه هذا الشكل إلى هلالي مما يعيق مرورها في الأوعية الدموية.', 
        color: '#ff6b6b',
        position: [-0.441, 0.229, -0.187],
        cameraTarget: [-0.004, 0, 0.005],
        cameraPosition: [3.546, 1.309, 1.247],
        imageUrl: 'https://images.unsplash.com/photo-1614935151651-0bea6508abb0?auto=format&fit=crop&q=80'
      },
      { 
        id: 'cell-membrane', 
        name: 'غشاء الخلية (Cell Membrane)', 
        function: 'غشاء مرن جداً وقوي يسمح للكرية بالانضغاط وتغيير شكلها للمرور عبر أضيق الشعيرات الدموية دون أن تتمزق.', 
        medicalImportance: 'يحتوي على مستضدات (Antigens) تحدد فصيلة الدم (A, B, AB, O)، ومهم جداً في عمليات نقل الدم.', 
        color: '#ff8787',
        position: [-0.073, 0.23, -0.031],
        cameraTarget: [-0.002, -0.002, 0.004],
        cameraPosition: [0.661, 0.826, -0.027],
        imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80'
      },
      { 
        id: 'hemoglobin', 
        name: 'السيتوبلازم والهيموجلوبين (Hemoglobin)', 
        function: 'الخلية ممتلئة ببروتين الهيموجلوبين الذي يرتبط بجزيئات الأكسجين في الرئتين ليحملها إلى جميع أنسجة الجسم.', 
        medicalImportance: 'نقص هذا البروتين أو الحديد المكون له يؤدي إلى "فقر الدم" (Anemia) والإرهاق الشديد.', 
        color: '#c92a2a',
        position: [0.329, 0.252, -0.323],
        cameraTarget: [-0.002, -0.002, 0.004],
        cameraPosition: [-0.882, 0.271, 0.729],
        imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80'
      }
    ],
    microscopeViews: [{ id: 'rbc1', type: 'مجهر إلكتروني ماسح', imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80', caption: 'كريات دم حمراء تتدفق في وعاء دموي.' }]
  },
  {
    id: 'white-blood-cell',
    title: 'خلية دم بيضاء',
    category: 'مناعية',
    description: 'خلايا الدم البيضاء هي جنود جهاز المناعة، تدافع عن الجسم ضد العدوى.',
    imageUrl: localAsset('cells/white_blood_cell_1779685987203.png'),
    modelUrl: localAsset('3D/virus+3d+model (2).glb'),
    organelles: [
      { id: 'segmented-nucleus', name: 'نواة مفصصة', function: 'تنظم وظائف الخلية.', medicalImportance: 'تستخدم لتشخيص نوع العدوى.', color: '#845ef7' }
    ],
    microscopeViews: [{ id: 'w1', type: 'المجهر الضوئي', imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80', caption: 'خلية دم بيضاء بنواة مفصصة.' }]
  },
  {
    id: 'skeletal-muscle-cell',
    title: 'خلية عضلية هيكلية',
    category: 'عضلية',
    description: 'الألياف العضلية الهيكلية هي خلايا أسطوانية طويلة مسؤولة عن الحركة الإرادية.',
    imageUrl: localAsset('cells/skeletal_muscle_cell_1779686001990.png'),
    modelUrl: localAsset('3D/muscle+cross-section+3d+model.glb'),
    cameraPosition: [-1.057, 0.191, 0.645],
    cameraTarget: [0.002, -0.01, 0.003],
    organelles: [
      { 
        id: 'myofibrils', 
        name: 'اللييفات العضلية', 
        function: 'خيوط تنزلق فوق بعضها لتسبب الانقباض.', 
        medicalImportance: 'أساسية لقوة العضلة.', 
        color: '#ff4b4b',
        position: [0.294, 0.371, -0.129],
        cameraTarget: [0.002, -0.01, 0.003],
        cameraPosition: [-0.785, 0.405, 0.574]
      }
    ],
    microscopeViews: [{ id: 'm1', type: 'المجهر الضوئي', imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d3655e?auto=format&fit=crop&q=80', caption: 'نسيج عضلي هيكلي.' }]
  },
  {
    id: 'sperm-cell',
    title: 'حيوان منوي (خلية منوية)',
    category: 'تكاثرية',
    description: 'خلية متخصصة للتكاثر تتميز برأس يحتوي على المادة الوراثية وسوط طويل للحركة.',
    imageUrl: localAsset('cells/sperm_cell_1779686015021.png'),
    modelUrl: localAsset('3D/cellular+organism+3d+model.glb'),
    organelles: [
      { id: 'flagellum', name: 'السوط', function: 'يساعد الحيوان المنوي على السباحة نحو البويضة.', medicalImportance: 'ضعف الحركة يسبب العقم.', color: '#a5d8ff' }
    ],
    microscopeViews: []
  },
  {
    id: 'osteocyte-cell',
    title: 'خلية عظمية (Osteocyte)',
    category: 'عظمية',
    description: 'الخلية العظمية توجد داخل تجاويف في النسيج العظمي وتساعد في الحفاظ على المادة الخلالية للعظم.',
    imageUrl: localAsset('cells/osteocyte_cell_1779686026819.png'),
    modelUrl: localAsset('3D/osteocyte+bone+cell+3d+model.glb'),
    cameraPosition: [-1.058, -0.001, -1.01],
    cameraTarget: [-0.004, 0.015, 0],
    organelles: [
      { id: 'cytoplasmic-processes', name: 'العمليات السيتوبلازمية (الشكل النجمي)', function: 'تحافظ على نسيج العظم وتستجيب للإجهاد الميكانيكي.', medicalImportance: 'شكلها النجمي بأذرع رفيعة (canaliculi) يسمح لها بالبقاء داخل المادة العظمية والتواصل.', color: '#748ffc', cameraPosition: [-1.058, -0.001, -1.01], cameraTarget: [-0.004, 0.015, 0] },
      { id: 'bone-matrix', name: 'المادة العظمية (Bone Matrix)', function: 'توفر القوة والدعم للعظم.', medicalImportance: 'المادة المحيطة بالخلية، تظهر صلبة وكثيفة وتمنح العظم صلابته المعهودة.', color: '#adb5bd', cameraPosition: [-1.058, -0.001, -1.01], cameraTarget: [-0.004, 0.015, 0] }
    ],
    microscopeViews: []
  },
  {
    id: 'keratinocyte-cell',
    title: 'خلية كيراتينية (Keratinocyte)',
    category: 'جلدية',
    description: 'الخلايا الكيراتينية تشكل الجزء الأكبر من البشرة وتنتج الكيراتين الذي يحمي الجلد.',
    imageUrl: localAsset('cells/keratinocyte_cell_1779686038687.png'),
    organelles: [
      { id: 'keratin', name: 'ألياف الكيراتين', function: 'حماية وتوفير بنية صلبة للجلد.', medicalImportance: 'نقصها يسبب أمراض الجلد.', color: '#fcc419' }
    ],
    microscopeViews: []
  },
  {
    id: 'cardiomyocyte-cell',
    title: 'خلية عضلية قلبية',
    category: 'عضلية',
    description: 'خلايا متفرعة ومخططة تشكل نسيج القلب. تنقبض بشكل لا إرادي لضخ الدم، وتتميز بقدرتها على توليد نبضاتها الكهربائية الخاصة.',
    imageUrl: localAsset('cells/cardiomyocyte_cell_1779686078434.png'),
    modelUrl: localAsset('3D/blood+vessel+3d+model.glb'),
    cameraPosition: [0.617, 0.21, 0.785],
    cameraTarget: [0.002, -0.041, 0.015],
    organelles: [
      { 
        id: 'intercalated-discs', 
        name: 'الأقراص البينية (Intercalated Discs)', 
        function: 'تربط الخلايا العضلية القلبية ببعضها ميكانيكياً وكهربائياً لتسمح بانقباض القلب ككتلة واحدة متزامنة.', 
        medicalImportance: 'خلل هذه الروابط يؤدي إلى عدم انتظام ضربات القلب (Arrhythmia) واعتلال عضلة القلب.', 
        color: '#ff4b4b',
        position: [-0.243, 0.598, -0.236],
        cameraTarget: [0.002, -0.041, 0.015],
        cameraPosition: [0.617, 0.21, 0.785],
        imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80'
      },
      { 
        id: 'myofibrils', 
        name: 'اللييفات العضلية (Myofibrils)', 
        function: 'تحتوي على خيوط الأكتين والميوسين التي تنزلق فوق بعضها البعض مسببة الانقباض العضلي للقلب.', 
        medicalImportance: 'تضخمها استجابةً لارتفاع ضغط الدم يؤدي إلى فشل القلب على المدى الطويل.', 
        color: '#f03e3e',
        position: [-0.06, 0.694, 0.168],
        cameraTarget: [0.002, -0.041, 0.015],
        cameraPosition: [0.679, 0.388, -0.328],
        imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f4956ce84?auto=format&fit=crop&q=80'
      },
      { 
        id: 'mitochondria', 
        name: 'الميتوكوندريا (Mitochondria)', 
        function: 'تشغل نسبة ضخمة من الخلية القلبية لتوفر طاقة (ATP) مستمرة لا تنقطع طوال حياة الإنسان.', 
        medicalImportance: 'نقص تروية القلب (الجلطة) يوقف عملها، مما يميت الخلية القلبية خلال دقائق.', 
        color: '#ff922b',
        position: [-0.179, 0.404, 0.168],
        cameraTarget: [0.002, -0.041, 0.015],
        cameraPosition: [0.511, -0.059, -0.447],
        imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80'
      },
      { 
        id: 'nucleus', 
        name: 'النواة (Nucleus)', 
        function: 'مركز التحكم. تتميز الخلية القلبية باحتوائها غالباً على نواة واحدة أو نواتين مركزيتين.', 
        medicalImportance: 'لا تنقسم الخلايا القلبية البالغة عادة، لذا يصعب تعويض التالف منها بعد الجلطات القلبية.', 
        color: '#9775fa',
        position: [-0.122, 0.654, 0.083],
        cameraTarget: [0.002, -0.041, 0.015],
        cameraPosition: [0.272, 0.478, 0.13],
        imageUrl: 'https://images.unsplash.com/photo-1614935151651-0bea6508abb0?auto=format&fit=crop&q=80'
      }
    ],
    microscopeViews: [{ id: 'c1', type: 'مجهر إلكتروني', imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d3655e?auto=format&fit=crop&q=80', caption: 'تخطيط الألياف العضلية القلبية والأقراص البينية.' }]
  },
  {
    id: 'adipocyte-cell',
    title: 'خلية دهنية (Adipocyte)',
    category: 'دهنية',
    description: 'الخلايا الدهنية متخصصة في تخزين الطاقة على شكل دهون.',
    imageUrl: localAsset('cells/adipocyte_cell_1779686093890.png'),
    modelUrl: localAsset('3D/adipocyte+3d+model.glb'),
    cameraPosition: [-1.617, -0.049, -0.609],
    cameraTarget: [-0.002, 0.008, 0.008],
    organelles: [
      { id: 'lipid-droplet', name: 'قطرة دهنية', function: 'تخزين الدهون والطاقة.', medicalImportance: 'زيادتها تؤدي للسمنة ومشاكل الأيض.', color: '#fcc419', cameraPosition: [-1.617, -0.049, -0.609], cameraTarget: [-0.002, 0.008, 0.008] },
      { id: 'nucleus', name: 'النواة', function: 'تحتوي على المادة الوراثية وتدفعها القطرة الدهنية للطرف.', medicalImportance: 'مؤشر على التمايز الكامل للخلية الدهنية.', color: '#9775fa', cameraPosition: [-1.617, -0.049, -0.609], cameraTarget: [-0.002, 0.008, 0.008] }
    ],
    microscopeViews: []
  },
  {
    id: 'chondrocyte-cell',
    title: 'خلية غضروفية (Chondrocyte)',
    category: 'غضروفية',
    description: 'الخلايا الوحيدة الموجودة في الغضروف السليم، وتفرز وتحافظ على مصفوفة الغضروف.',
    imageUrl: localAsset('cells/chondrocyte_cell_1779686105714.png'),
    organelles: [
      { id: 'matrix', name: 'المصفوفة الغضروفية', function: 'توفير مرونة ودعم للمفاصل.', medicalImportance: 'تأكلها يسبب التهاب المفاصل.', color: '#a5d8ff' }
    ],
    microscopeViews: []
  },
  {
    id: 'enterocyte-cell',
    title: 'خلية معوية (Enterocyte)',
    category: 'ظهارية',
    description: 'خلايا تمتص العناصر الغذائية في الأمعاء وتتميز بوجود زغيبات كثيفة على سطحها.',
    imageUrl: localAsset('cells/enterocyte_cell_1779686119382.png'),
    modelUrl: localAsset('3D/cell+model+3d+model.glb'),
    cameraPosition: [-1.58, 0.102, -1.556],
    cameraTarget: [-0.003, 0.013, 0.003],
    organelles: [
      { id: 'microvilli', name: 'الزغيبات', function: 'زيادة مساحة سطح الامتصاص.', medicalImportance: 'تلفها يسبب سوء الامتصاص (مثل مرض السيلياك).', color: '#f06595', cameraPosition: [-1.58, 0.102, -1.556], cameraTarget: [-0.003, 0.013, 0.003] }
    ],
    microscopeViews: []
  },
  {
    id: 'pancreatic-beta-cell',
    title: 'خلية بيتا البنكرياسية',
    category: 'غدية',
    description: 'خلايا في البنكرياس تنتج وتخزن وتفرز هرمون الأنسولين.',
    imageUrl: localAsset('cells/pancreatic_beta_cell_1779686130291.png'),
    organelles: [
      { id: 'insulin-vesicles', name: 'حويصلات الأنسولين', function: 'تخزين وإفراز الأنسولين لضبط سكر الدم.', medicalImportance: 'تدميرها يسبب مرض السكري من النوع 1.', color: '#20c997' }
    ],
    microscopeViews: []
  }
];
