import { Breadcrumb, Button, Card, Image, Tag, Typography } from "antd"

const { Title, Text, Paragraph } = Typography

const featuredPost = {
  id: "1",
  title: "Anteposuerit litterarum formas.",
  excerpt:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut ...",
  author: "bigcommerce",
  date: "11th Apr 2019",
  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/office-chair-modern-furniture-dJ7LdDrftoMJZ2PWBSaaVVFdAiOckt.jpg",
  slug: "anteposuerit-litterarum-formas",
}

const recentPosts = [
  {
    id: "2",
    title: "Anteposuerit litterarum formas.",
    excerpt: "",
    author: "bigcommerce",
    date: "11th Apr 2019",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/office-chair-modern-furniture-dJ7LdDrftoMJZ2PWBSaaVVFdAiOckt.jpg",
    slug: "anteposuerit-litterarum-formas-2",
  },
  {
    id: "3",
    title: "At vero eos et accusam et justo",
    excerpt: "",
    author: "bigcommerce",
    date: "11th Apr 2019",
    image: "/office-chairs-furniture.jpg",
    slug: "at-vero-eos-et-accusam",
  },
  {
    id: "4",
    title: "Duis autem vel eum iriure dolor",
    excerpt: "",
    author: "bigcommerce",
    date: "11th Apr 2019",
    image: "/white-spheres-modern-design.jpg",
    slug: "duis-autem-vel-eum",
  },
  {
    id: "5",
    title: "Tempor invidunt ut labore et dolore magna",
    excerpt: "",
    author: "bigcommerce",
    date: "11th Apr 2019",
    image: "/kitchen-utensils-cooking-tools.jpg",
    slug: "tempor-invidunt-ut-labore",
  },
  {
    id: "6",
    title: "Your first blog post!",
    excerpt: "",
    author: "bigcommerce",
    date: "15th Feb 2014",
    image: "/office-chair-modern-furniture.jpg",
    slug: "your-first-blog-post",
  },
]

const popularTags = ["#Blog", "#SEO"]

export default function Blog() {


  return (
    <>
      {/* Blog header section with title and breadcrumb */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Title level={1} className="!text-4xl !font-bold !text-gray-900 !mb-4">
            Blog
          </Title>
          <div className="flex justify-center">
            <Breadcrumb style={{cursor: "pointer"}}
              items={[
                {
                  title: <span className="text-orange-500 hover:text-orange-600">Home</span>,
                },
                {
                  title: <span className="text-gray-600">Blog</span>,
                },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Blog Post */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-none p-0" bodyStyle={{ padding: 0 }}>
              <div className="relative aspect-[2/1] mb-6">
                <Image
                  src={featuredPost.image || "/placeholder.svg"}
                  alt={featuredPost.title}
                  width={800}
                  height={400}
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <Title level={2} className="!text-2xl !font-semibold !text-gray-900 !mb-3">
                  {featuredPost.title}
                </Title>
                <Text className="text-sm text-gray-500 block mb-4">
                  Posted by <span className="text-gray-900 font-medium">{featuredPost.author}</span> / {featuredPost.date}
                </Text>
                <Paragraph className="!text-gray-600 !leading-relaxed !mb-6">{featuredPost.excerpt}</Paragraph>
                <Button
                  type="default"
                  className="!text-sm !font-medium !bg-transparent !border-gray-300 !text-gray-700 hover:!border-gray-400 hover:!text-gray-900"
                >
                  READ MORE
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Posts */}
            <div>
              <Title level={3} className="!text-xl !font-semibold !text-gray-900 !mb-6">
                Recent Posts
              </Title>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex gap-4 group cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Text className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors block leading-tight">
                        {post.title}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1 block">{post.date}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div>
              <Title level={3} className="!text-xl !font-semibold !text-gray-900 !mb-6">
                Popular Tags
              </Title>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  /* Using Ant Design Tag component instead of Button */
                  <Tag
                    key={tag}
                    className="!text-xs !font-normal !text-gray-600 !bg-transparent !border-gray-300 hover:!border-gray-400 hover:!text-gray-900 cursor-pointer !px-3 !py-1"
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}
