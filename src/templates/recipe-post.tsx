import React, { ReactNode, FunctionComponent } from 'react'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import { styled, Theme, Button, Typography, Box } from '@material-ui/core'
import Tag from '../components/Tag'
import BackIcon from '@material-ui/icons/ArrowBackIos'
import Ingredients from '../components/Ingredients'
import Content, { HTMLContent } from '../components/Content'

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#FFFBFB',
  [theme.breakpoints.up('md')]: {
    height: '100vh',
    flexDirection: 'row',
  },
}))

const LeftPanel = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(1),
    overflowY: 'auto',
    backgroundColor: '#3f51b5 ',
    color: theme.palette.common.white,
    '& *': {
      color: theme.palette.common.white,
    },
    boxShadow: theme.shadows[4],
    minWidth: 300,
    maxWidth: 300,
    marginRight: theme.spacing(2),
  },
}))

const LeftPanelContent = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    backgroundColor: '#3f51b5',
    color: theme.palette.common.white,
    '& *': {
      color: theme.palette.common.white,
    },
    boxShadow: theme.shadows[4],
    padding: theme.spacing(2),
  },
  [theme.breakpoints.up('md')]: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(0, 4, 0, 2),
  },
}))

const Body = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  textAlign: 'justify',
  padding: theme.spacing(2),
}))

const TitleContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
}))

type ImageProps = { src: string }
const Image = styled(({ src, ...props }: ImageProps) => <div {...props} />)(
  ({ theme, src }: ImageProps & { theme: Theme }) => ({
    [theme.breakpoints.up('md')]: {
      height: 150,
    },
    height: 300,
    width: '100%',
    backgroundImage: `url(${src})`,
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
  })
)

const TagsContainer = styled('div')(({ theme }) => ({
  '& > *': {
    marginRight: theme.spacing(1),
  },
}))

type TitleProps = { title: string; tags: string[] }
function Title({ title, tags }: TitleProps) {
  return (
    <>
      <TitleContainer>
        <Typography variant="h2" align="left">
          {title}
        </Typography>
      </TitleContainer>
      <TagsContainer>
        {tags.map(tag => (
          <Tag key={tag} name={tag} />
        ))}
      </TagsContainer>
    </>
  )
}

function BackToHome() {
  return (
    <Link to="/">
      <Button startIcon={<BackIcon />}>Retour</Button>
    </Link>
  )
}

interface RecipePostTemplateProps {
  content: string | ReactNode
  title: string
  duration: string
  servings: number
  ingredients: string[]
  image: string
  tags: string[]
  contentComponent?: FunctionComponent<{ content: string | ReactNode }>
  helmet?: ReactNode
}

const visibleOnlyOnMobile = { xs: 'block', sm: 'block', md: 'none' }
const hiddenOnlyOnMobile = { xs: 'none', sm: 'none', md: 'block' }

export const RecipePostTemplate = ({
  content,
  contentComponent,
  title,
  duration,
  servings,
  ingredients,
  image,
  tags,
  helmet,
}: RecipePostTemplateProps) => {
  const RecipeContent = contentComponent || Content

  return (
    <Root>
      {helmet || ''}
      <Box p={2} display={visibleOnlyOnMobile}>
        <BackToHome />
        <Title title={title} tags={tags} />
      </Box>
      <LeftPanel>
        <Box display={hiddenOnlyOnMobile}>
          <BackToHome />
        </Box>
        <LeftPanelContent>
          <Box display={hiddenOnlyOnMobile}>
            <Box display="flex" justifyContent="center" py={1}>
              {image && <Image src={image} />}
            </Box>
          </Box>
          {duration && (
            <Typography variant="subtitle1">
              <Typography variant="h6" component="span">
                Durée :{' '}
              </Typography>
              {duration}
            </Typography>
          )}
          <Ingredients ingredients={ingredients} servings={servings} />
        </LeftPanelContent>
      </LeftPanel>

      <Body>
        <Box display={hiddenOnlyOnMobile}>
          <Title title={title} tags={tags} />
        </Box>

        <Box display={visibleOnlyOnMobile}>
          <Box display="flex" justifyContent="center" py={1}>
            {image && <Image src={image} />}
          </Box>
        </Box>
        <Box display={hiddenOnlyOnMobile} pt={4} />

        <RecipeContent content={content} />
      </Body>
    </Root>
  )
}

export default function RecipePost({ data }: Props) {
  const { markdownRemark: recipe } = data

  return (
    <RecipePostTemplate
      content={recipe.html}
      contentComponent={HTMLContent}
      helmet={
        <Helmet>
          <title>{`${recipe.frontmatter.title}`}</title>
        </Helmet>
      }
      duration={recipe.frontmatter.duration}
      servings={recipe.frontmatter.servings}
      ingredients={recipe.frontmatter.ingredients}
      image={recipe.frontmatter.image.childImageSharp.fluid.src}
      tags={recipe.frontmatter.tags}
      title={recipe.frontmatter.title}
    />
  )
}

interface Props {
  data: {
    markdownRemark: {
      id: string
      html: string
      frontmatter: {
        title: string
        duration: string
        servings: number
        ingredients: string[]
        image: {
          childImageSharp: { fluid: { src: string } }
        }
        tags: string[]
      }
    }
  }
}

export const pageQuery = graphql`
  query RecipePostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
        duration
        servings
        ingredients
        image {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        tags
      }
    }
  }
`
